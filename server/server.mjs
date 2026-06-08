import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createDataStore } from "./dataStore.mjs";
import { createDefaultSiteData } from "./defaultData.mjs";
import { loadSeedSiteData } from "./seedData.mjs";

const ROOT_DIR = resolve(fileURLToPath(new URL("..", import.meta.url)));
const DEFAULT_PUBLIC_DIR = join(ROOT_DIR, "public");
const DEFAULT_DATA_FILE = join(ROOT_DIR, "data", "site-data.json");
const MIME_TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".mp4", "video/mp4"],
  [".mov", "video/quicktime"],
  [".webm", "video/webm"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".webp", "image/webp"]
]);
const ALLOWED_UPLOAD_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".mp4", ".webm", ".mov"]);
const IMAGE_UPLOAD_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_UPLOAD_BYTES = 300 * 1024 * 1024;
const IMAGE_MAX_WIDTH = 1920;
const IMAGE_MAX_HEIGHT = 1920;
const IMAGE_QUALITY = 86;
const require = createRequire(import.meta.url);

function loadSharp() {
  try {
    return require("sharp");
  } catch {
    const bundledSharpPath = join(resolve(process.execPath, "..", ".."), "node_modules", ".pnpm", "sharp@0.34.5", "node_modules", "sharp");
    return require(bundledSharpPath);
  }
}

const sharp = loadSharp();

function jsonResponse(response, status, payload) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

async function parseJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Invalid JSON body.");
    error.status = 400;
    throw error;
  }
}

async function readRequestBuffer(request, maxBytes = MAX_UPLOAD_BYTES) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBytes) {
      const error = new Error("上传文件过大。");
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function parseMultipartFile(request, body) {
  const contentType = request.headers["content-type"] || "";
  const boundary = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/)?.[1] || contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/)?.[2];
  if (!boundary) {
    const error = new Error("请使用表单上传文件。");
    error.status = 400;
    throw error;
  }
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  let offset = body.indexOf(boundaryBuffer);
  while (offset >= 0) {
    const nextOffset = body.indexOf(boundaryBuffer, offset + boundaryBuffer.length);
    if (nextOffset < 0) break;
    let part = body.subarray(offset + boundaryBuffer.length, nextOffset);
    if (part.subarray(0, 2).toString() === "\r\n") part = part.subarray(2);
    if (part.subarray(part.length - 2).toString() === "\r\n") part = part.subarray(0, part.length - 2);
    const headerEnd = part.indexOf(Buffer.from("\r\n\r\n"));
    if (headerEnd > 0) {
      const headers = part.subarray(0, headerEnd).toString("utf8");
      const content = part.subarray(headerEnd + 4);
      const disposition = headers.match(/content-disposition:[^\r\n]+/i)?.[0] || "";
      const fieldName = disposition.match(/name="([^"]+)"/)?.[1] || "";
      const fileName = disposition.match(/filename="([^"]*)"/)?.[1] || "";
      if (fieldName === "file" && fileName) {
        return {
          originalName: fileName,
          type: headers.match(/content-type:\s*([^\r\n]+)/i)?.[1] || "application/octet-stream",
          buffer: content
        };
      }
    }
    offset = nextOffset;
  }
  const error = new Error("没有找到上传文件。");
  error.status = 400;
  throw error;
}

function sanitizeSegment(value, fallback) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || fallback;
}

function sanitizeFileName(fileName) {
  const ext = extname(fileName).toLowerCase();
  const base = sanitizeSegment(fileName.slice(0, -ext.length), "media");
  return { base, ext };
}

async function normalizeUpload(upload, ext) {
  if (!IMAGE_UPLOAD_EXTENSIONS.has(ext)) {
    return {
      buffer: upload.buffer,
      ext,
      type: upload.type,
      optimized: false,
      originalSize: upload.buffer.length
    };
  }
  try {
    const buffer = await sharp(upload.buffer)
      .rotate()
      .resize({
        width: IMAGE_MAX_WIDTH,
        height: IMAGE_MAX_HEIGHT,
        fit: "inside",
        withoutEnlargement: true
      })
      .webp({ quality: IMAGE_QUALITY, effort: 4 })
      .toBuffer();
    return {
      buffer,
      ext: ".webp",
      type: "image/webp",
      optimized: true,
      originalSize: upload.buffer.length
    };
  } catch {
    const error = new Error("图片文件无法识别，请重新选择 jpg、png 或 webp 图片。");
    error.status = 400;
    throw error;
  }
}

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function signToken(secret, payload) {
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = createHmac("sha256", secret).update(encodedPayload).digest("base64url");
  return `${encodedPayload}.${signature}`;
}

function verifyToken(secret, token) {
  if (!token || !token.includes(".")) return false;
  const [encodedPayload, signature] = token.split(".");
  const expected = createHmac("sha256", secret).update(encodedPayload).digest("base64url");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return false;
  }
  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

function getBearerToken(request) {
  const header = request.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

function publicSiteData(data) {
  const { applications, ...siteData } = data;
  return siteData;
}

function textValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function listValue(value) {
  if (Array.isArray(value)) return value.map(textValue).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/[，,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function createApplication(body) {
  const type = body.type === "operation" ? "operation" : body.type === "player" ? "player" : "";
  const base = {
    id: randomUUID(),
    type,
    name: textValue(body.name),
    studentId: textValue(body.studentId),
    gradeMajor: textValue(body.gradeMajor),
    contact: textValue(body.contact),
    intro: textValue(body.intro),
    status: "未联系",
    createdAt: new Date().toISOString()
  };
  if (!base.type || !base.name || !base.studentId || !base.gradeMajor || !base.contact || !base.intro) {
    const error = new Error("请填写完整的报名信息。");
    error.status = 400;
    throw error;
  }
  if (base.type === "player") {
    const application = {
      ...base,
      height: textValue(body.height),
      weight: textValue(body.weight),
      position: textValue(body.position),
      experience: textValue(body.experience),
      strengths: listValue(body.strengths)
    };
    if (!application.height || !application.position || !application.experience || !application.strengths.length) {
      const error = new Error("请填写完整的球员报名信息。");
      error.status = 400;
      throw error;
    }
    return application;
  }
  const application = {
    ...base,
    operationRole: textValue(body.operationRole),
    operationExperience: textValue(body.operationExperience),
    portfolio: textValue(body.portfolio)
  };
  if (!application.operationRole || !application.operationExperience) {
    const error = new Error("请填写完整的运营报名信息。");
    error.status = 400;
    throw error;
  }
  return application;
}

async function sendStaticFile(response, filePath) {
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return false;
    }
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return false;
  }

  const ext = extname(filePath).toLowerCase();
  response.writeHead(200, {
    "content-type": MIME_TYPES.get(ext) || "application/octet-stream",
    "cache-control": "no-cache"
  });
  createReadStream(filePath).pipe(response);
  return true;
}

export function createApp({ dataStore, adminPassword, publicDir = DEFAULT_PUBLIC_DIR }) {
  const secret = process.env.SESSION_SECRET || randomUUID();
  const password = adminPassword || process.env.ADMIN_PASSWORD || "team-admin-2026";

  return createServer(async (request, response) => {
    const url = new URL(request.url, "http://localhost");

    try {
      if (request.method === "GET" && url.pathname === "/api/site") {
        jsonResponse(response, 200, publicSiteData(await dataStore.read()));
        return;
      }

      if (request.method === "POST" && url.pathname === "/api/login") {
        const body = await parseJson(request);
        if (body.password !== password) {
          jsonResponse(response, 401, { error: "密码不正确" });
          return;
        }
        const token = signToken(secret, {
          role: "admin",
          exp: Date.now() + 1000 * 60 * 60 * 12
        });
        jsonResponse(response, 200, { token, user: { name: "球队管理员" } });
        return;
      }

      if (request.method === "POST" && url.pathname === "/api/admin/upload") {
        const authorized = verifyToken(secret, getBearerToken(request));
        if (!authorized) {
          jsonResponse(response, 401, { error: "请先登录后台" });
          return;
        }
        const upload = parseMultipartFile(request, await readRequestBuffer(request));
        const { base, ext } = sanitizeFileName(upload.originalName);
        if (!ALLOWED_UPLOAD_EXTENSIONS.has(ext)) {
          jsonResponse(response, 400, { error: "仅支持 jpg、png、webp、mp4、webm、mov 文件。" });
          return;
        }
        const context = sanitizeSegment(url.searchParams.get("context"), "general");
        const normalizedUpload = await normalizeUpload(upload, ext);
        const fileName = `${Date.now().toString(36)}-${randomUUID().slice(0, 8)}-${base}${normalizedUpload.ext}`;
        const uploadDir = join(publicDir, "assets", "uploads", context);
        await mkdir(uploadDir, { recursive: true });
        await writeFile(join(uploadDir, fileName), normalizedUpload.buffer);
        jsonResponse(response, 201, {
          path: `/assets/uploads/${context}/${fileName}`,
          name: upload.originalName,
          type: normalizedUpload.type,
          size: normalizedUpload.buffer.length,
          originalSize: normalizedUpload.originalSize,
          optimized: normalizedUpload.optimized
        });
        return;
      }

      if (url.pathname === "/api/admin/site") {
        const authorized = verifyToken(secret, getBearerToken(request));
        if (!authorized) {
          jsonResponse(response, 401, { error: "请先登录后台" });
          return;
        }
        if (request.method === "GET") {
          jsonResponse(response, 200, publicSiteData(await dataStore.read()));
          return;
        }
        if (request.method === "PUT") {
          const body = await parseJson(request);
          const current = await dataStore.read();
          const saved = await dataStore.write({
            ...body,
            applications: current.applications || []
          });
          jsonResponse(response, 200, publicSiteData(saved));
          return;
        }
      }

      if (request.method === "POST" && url.pathname === "/api/applications") {
        const body = await parseJson(request);
        const current = await dataStore.read();
        const application = createApplication(body);
        const applications = Array.isArray(current.applications) ? current.applications : [];
        const saved = await dataStore.write({
          ...current,
          applications: [application, ...applications]
        });
        jsonResponse(response, 201, { application: saved.applications[0] });
        return;
      }

      if (url.pathname === "/api/admin/applications" || url.pathname.startsWith("/api/admin/applications/")) {
        const authorized = verifyToken(secret, getBearerToken(request));
        if (!authorized) {
          jsonResponse(response, 401, { error: "请先登录后台" });
          return;
        }
        const current = await dataStore.read();
        const applications = Array.isArray(current.applications) ? current.applications : [];
        if (request.method === "GET" && url.pathname === "/api/admin/applications") {
          jsonResponse(response, 200, applications);
          return;
        }
        const id = decodeURIComponent(url.pathname.replace("/api/admin/applications/", ""));
        const index = applications.findIndex((item) => item.id === id);
        if (index < 0) {
          jsonResponse(response, 404, { error: "报名记录不存在" });
          return;
        }
        if (request.method === "PATCH") {
          const body = await parseJson(request);
          const nextApplications = [...applications];
          nextApplications[index] = {
            ...nextApplications[index],
            status: textValue(body.status) || nextApplications[index].status,
            note: textValue(body.note),
            updatedAt: new Date().toISOString()
          };
          const saved = await dataStore.write({ ...current, applications: nextApplications });
          jsonResponse(response, 200, saved.applications[index]);
          return;
        }
        if (request.method === "DELETE") {
          const nextApplications = applications.filter((item) => item.id !== id);
          await dataStore.write({ ...current, applications: nextApplications });
          jsonResponse(response, 200, { ok: true });
          return;
        }
      }

      if (request.method !== "GET") {
        jsonResponse(response, 404, { error: "Not found" });
        return;
      }

      const cleanPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
      const staticPath = resolve(publicDir, `.${cleanPath}`);
      const publicRoot = resolve(publicDir);
      if (staticPath.startsWith(publicRoot) && extname(staticPath)) {
        await sendStaticFile(response, staticPath);
        return;
      }

      await sendStaticFile(response, join(publicDir, "index.html"));
    } catch (error) {
      const status = error.status || 500;
      jsonResponse(response, status, { error: status === 500 ? "服务器暂时不可用" : error.message });
    }
  });
}

const isDirectRun = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  await mkdir(join(ROOT_DIR, "data"), { recursive: true });
  const dataStore = createDataStore({
    dataFile: process.env.DATA_FILE || DEFAULT_DATA_FILE,
    seedData: await loadSeedSiteData()
  });
  const port = Number(process.env.PORT || 3000);
  const app = createApp({ dataStore, adminPassword: process.env.ADMIN_PASSWORD });
  app.listen(port, () => {
    console.log(`College basketball website running at http://localhost:${port}`);
    console.log("Default admin password: team-admin-2026");
  });
}
