import { readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const publicAssetsDir = join(rootDir, "public", "assets");
const imageExtensions = new Set([".jpg", ".jpeg", ".png"]);
const textExtensions = new Set([".css", ".js", ".json", ".mjs", ".md", ".html"]);
const ignoredDirs = new Set(["node_modules", ".git"]);

function loadSharp() {
  try {
    return require("sharp");
  } catch {
    const bundledSharpPath = join(resolve(process.execPath, "..", ".."), "node_modules", ".pnpm", "sharp@0.34.5", "node_modules", "sharp");
    return require(bundledSharpPath);
  }
}

const sharp = loadSharp();

async function walkFiles(dir, shouldSkipDir = () => false) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!shouldSkipDir(entry.name, fullPath)) {
        files.push(...(await walkFiles(fullPath, shouldSkipDir)));
      }
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function toWebPath(filePath) {
  return `/${relative(join(rootDir, "public"), filePath).split(sep).join("/")}`;
}

async function optimizeImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!imageExtensions.has(ext)) return null;
  const targetPath = filePath.slice(0, -ext.length) + ".webp";
  try {
    const original = await stat(filePath);
    await sharp(filePath)
      .rotate()
      .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 86, effort: 4 })
      .toFile(targetPath);
    const optimized = await stat(targetPath);
    return {
      filePath,
      targetPath,
      oldWebPath: toWebPath(filePath),
      newWebPath: toWebPath(targetPath),
      oldTextPath: relative(rootDir, filePath).split(sep).join("/"),
      newTextPath: relative(rootDir, targetPath).split(sep).join("/"),
      originalSize: original.size,
      optimizedSize: optimized.size
    };
  } catch (error) {
    return {
      filePath,
      skipped: true,
      reason: error.message
    };
  }
}

async function updateTextReferences(changes) {
  const files = await walkFiles(rootDir, (name) => ignoredDirs.has(name));
  let updatedFiles = 0;
  for (const filePath of files) {
    if (!textExtensions.has(extname(filePath).toLowerCase())) continue;
    let content = await readFile(filePath, "utf8");
    let nextContent = content;
    for (const change of changes) {
      nextContent = nextContent.split(change.oldWebPath).join(change.newWebPath);
      nextContent = nextContent.split(change.oldTextPath).join(change.newTextPath);
    }
    if (nextContent !== content) {
      await writeFile(filePath, nextContent);
      updatedFiles += 1;
    }
  }
  return updatedFiles;
}

function formatBytes(value) {
  return `${(value / 1024 / 1024).toFixed(2)}MB`;
}

const imageFiles = await walkFiles(publicAssetsDir);
const results = [];
for (const filePath of imageFiles) {
  results.push(await optimizeImage(filePath));
}

const changes = results.filter((item) => item && !item.skipped);
const skipped = results.filter((item) => item?.skipped);
const updatedFiles = await updateTextReferences(changes);

for (const change of changes) {
  await rm(change.filePath, { force: true });
}

const originalTotal = changes.reduce((sum, item) => sum + item.originalSize, 0);
const optimizedTotal = changes.reduce((sum, item) => sum + item.optimizedSize, 0);

console.log(`optimized=${changes.length}`);
console.log(`skipped=${skipped.length}`);
console.log(`updatedTextFiles=${updatedFiles}`);
console.log(`before=${formatBytes(originalTotal)}`);
console.log(`after=${formatBytes(optimizedTotal)}`);
console.log(`saved=${formatBytes(originalTotal - optimizedTotal)}`);
if (skipped.length) {
  console.log("skippedFiles=");
  for (const item of skipped) {
    console.log(`- ${relative(rootDir, item.filePath)}: ${item.reason}`);
  }
}
