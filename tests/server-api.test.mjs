import assert from "node:assert/strict";
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { createApp } from "../server/server.mjs";
import { createDataStore } from "../server/dataStore.mjs";
import { createDefaultSiteData } from "../server/defaultData.mjs";

async function withServer(t, handler) {
  const dir = await mkdtemp(join(tmpdir(), "team-site-api-"));
  const publicDir = join(dir, "public");
  await mkdir(join(publicDir, "assets", "gallery", "highlights", "videos"), { recursive: true });
  await mkdir(join(publicDir, "assets"), { recursive: true });
  await Promise.all([
    copyFile(join(process.cwd(), "public", "index.html"), join(publicDir, "index.html")),
    copyFile(join(process.cwd(), "public", "styles.css"), join(publicDir, "styles.css")),
    copyFile(join(process.cwd(), "public", "app.js"), join(publicDir, "app.js")),
    copyFile(join(process.cwd(), "public", "assets", "team-huddle.webp"), join(publicDir, "assets", "team-huddle.webp")),
    writeFile(join(publicDir, "assets", "gallery", "highlights", "videos", "highlight-video-1.mp4"), "fake video")
  ]);
  const dataStore = createDataStore({
    dataFile: join(dir, "site-data.json"),
    seedData: createDefaultSiteData()
  });
  const app = createApp({
    dataStore,
    adminPassword: "secret-pass",
    publicDir
  });
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await rm(dir, { recursive: true, force: true });
  });
  return handler(baseUrl);
}

test("public site data is readable without admin login", async (t) => {
  await withServer(t, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/site`);
    const data = await response.json();

    assert.equal(response.status, 200);
    assert.equal(data.team.primaryColor, "#3b146f");
    assert.ok(data.recruitment.steps.includes("填写报名信息"));
  });
});

test("admin data update requires login token and changes public content", async (t) => {
  await withServer(t, async (baseUrl) => {
    const denied = await fetch(`${baseUrl}/api/admin/site`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ team: { name: "未授权" } })
    });

    const login = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: "secret-pass" })
    });
    const { token } = await login.json();

    const current = await fetch(`${baseUrl}/api/admin/site`, {
      headers: { authorization: `Bearer ${token}` }
    }).then((response) => response.json());
    current.team.name = "深紫学院篮球队";

    const saved = await fetch(`${baseUrl}/api/admin/site`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json"
      },
      body: JSON.stringify(current)
    });
    const publicData = await fetch(`${baseUrl}/api/site`).then((response) => response.json());

    assert.equal(denied.status, 401);
    assert.equal(login.status, 200);
    assert.equal(saved.status, 200);
    assert.equal(publicData.team.name, "深紫学院篮球队");
  });
});

test("server falls back to homepage for front-end routes", async (t) => {
  await withServer(t, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/roster`);
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.match(html, /人工智能篮球队官网/);
    assert.match(html, /<div id="app">/);
  });
});

test("missing static assets do not crash the server", async (t) => {
  await withServer(t, async (baseUrl) => {
    const missing = await fetch(`${baseUrl}/favicon.ico`);
    const api = await fetch(`${baseUrl}/api/site`);

    assert.equal(missing.status, 404);
    assert.equal(api.status, 200);
  });
});

test("static assets are served without sticky browser cache during local design work", async (t) => {
  await withServer(t, async (baseUrl) => {
    const css = await fetch(`${baseUrl}/styles.css`);
    const js = await fetch(`${baseUrl}/app.js`);

    assert.equal(css.headers.get("cache-control"), "no-cache");
    assert.equal(js.headers.get("cache-control"), "no-cache");
  });
});

test("uploaded highlight videos are served with a video content type", async (t) => {
  await withServer(t, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/assets/gallery/highlights/videos/highlight-video-1.mp4`);

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "video/mp4");
  });
});

test("admins can upload media files and receive a public asset path", async (t) => {
  await withServer(t, async (baseUrl) => {
    const deniedData = new FormData();
    deniedData.append("file", new Blob(["fake video"], { type: "video/mp4" }), "team.mp4");
    const denied = await fetch(`${baseUrl}/api/admin/upload?context=news`, {
      method: "POST",
      body: deniedData
    });
    const login = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: "secret-pass" })
    });
    const { token } = await login.json();
    const formData = new FormData();
    formData.append("file", new Blob(["fake video"], { type: "video/mp4" }), "team video.mp4");
    const uploaded = await fetch(`${baseUrl}/api/admin/upload?context=news`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: formData
    });
    const payload = await uploaded.json();
    assert.equal(denied.status, 401);
    assert.equal(uploaded.status, 201);
    assert.match(payload.path, /^\/assets\/uploads\/news\/[a-z0-9-]+-team-video\.mp4$/);

    const asset = await fetch(`${baseUrl}${payload.path}`);
    const content = await asset.text();

    assert.equal(asset.status, 200);
    assert.equal(asset.headers.get("content-type"), "video/mp4");
    assert.equal(content, "fake video");
  });
});

test("uploaded images are optimized for web delivery", async (t) => {
  await withServer(t, async (baseUrl) => {
    const login = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: "secret-pass" })
    });
    const { token } = await login.json();
    const originalImage = await readFile(join(process.cwd(), "public", "assets", "team-huddle.webp"));
    const formData = new FormData();
    formData.append("file", new Blob([originalImage], { type: "image/webp" }), "team huddle.webp");

    const uploaded = await fetch(`${baseUrl}/api/admin/upload?context=gallery`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: formData
    });
    const payload = await uploaded.json();
    const asset = await fetch(`${baseUrl}${payload.path}`);
    const optimizedImage = Buffer.from(await asset.arrayBuffer());

    assert.equal(uploaded.status, 201);
    assert.match(payload.path, /^\/assets\/uploads\/gallery\/[a-z0-9-]+-team-huddle\.webp$/);
    assert.equal(payload.type, "image/webp");
    assert.equal(payload.optimized, true);
    assert.ok(payload.size < payload.originalSize);
    assert.equal(asset.status, 200);
    assert.equal(asset.headers.get("content-type"), "image/webp");
    assert.ok(optimizedImage.length < originalImage.length);
  });
});

test("recruitment applications can be submitted publicly and reviewed by admins", async (t) => {
  await withServer(t, async (baseUrl) => {
    const playerApplication = {
      type: "player",
      name: "王同学",
      studentId: "20260001",
      gradeMajor: "大一 · 人工智能",
      contact: "wx: ai-basketball",
      height: "180cm",
      weight: "",
      position: "后卫",
      experience: "班赛",
      strengths: ["投篮", "防守"],
      intro: "想参加球队训练和比赛。"
    };
    const operatorApplication = {
      type: "operation",
      name: "李同学",
      studentId: "20260002",
      gradeMajor: "大二 · 智能医学工程",
      contact: "13800000000",
      operationRole: "摄影",
      operationExperience: "有活动拍摄经验",
      portfolio: "https://example.com/work",
      intro: "想记录球队故事。"
    };

    const denied = await fetch(`${baseUrl}/api/admin/applications`);
    const submittedPlayer = await fetch(`${baseUrl}/api/applications`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(playerApplication)
    });
    const submittedOperator = await fetch(`${baseUrl}/api/applications`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(operatorApplication)
    });
    const login = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: "secret-pass" })
    });
    const { token } = await login.json();
    const adminList = await fetch(`${baseUrl}/api/admin/applications`, {
      headers: { authorization: `Bearer ${token}` }
    });
    const applications = await adminList.json();

    assert.equal(denied.status, 401);
    assert.equal(submittedPlayer.status, 201);
    assert.equal(submittedOperator.status, 201);
    assert.equal(adminList.status, 200);
    assert.equal(applications.length, 2);
    assert.deepEqual(
      applications.map((item) => item.type),
      ["operation", "player"]
    );
    assert.equal(applications[0].status, "未联系");
    assert.equal(applications[1].position, "后卫");
    assert.deepEqual(applications[1].strengths, ["投篮", "防守"]);
  });
});
