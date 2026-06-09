import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

import { createDefaultSiteData } from "../server/defaultData.mjs";
import { loadSeedSiteData } from "../server/seedData.mjs";

const REQUIRED_COLLECTIONS = ["matches", "players", "news", "gallery", "sponsors"];

function assertSiteShape(data, sourceName) {
  assert.equal(typeof data.team?.name, "string", `${sourceName} requires team.name`);
  for (const key of REQUIRED_COLLECTIONS) {
    assert.ok(Array.isArray(data[key]), `${sourceName} requires ${key} array`);
  }
  assert.ok(Array.isArray(data.recruitment?.steps), `${sourceName} requires recruitment.steps array`);
  assert.ok(Array.isArray(data.navigation), `${sourceName} requires navigation array`);
  assert.ok(Array.isArray(data.gallerySections), `${sourceName} requires gallerySections array`);
  assert.ok(Array.isArray(data.gallerySubsections), `${sourceName} requires gallerySubsections array`);
  assert.ok(data.navigation.every((item) => item.path && item.label), `${sourceName} navigation items need path and label`);
  assert.ok(data.gallerySections.every((item) => item.slug && item.path && item.title), `${sourceName} gallery sections need slug, path and title`);
  assert.ok(data.gallerySubsections.every((item) => item.path && item.title && item.kind), `${sourceName} gallery subsections need path, title and kind`);
}

async function readJsonIfPresent(filePath) {
  try {
    await access(filePath);
  } catch {
    return null;
  }
  return JSON.parse(await readFile(filePath, "utf8"));
}

const appScript = await readFile("public/app.js", "utf8");
new Function(appScript);
assert.doesNotMatch(appScript, /const\s+navItems\s*=/, "navigation should not be locked to navItems");
assert.match(appScript, /state\.data\?\.navigation/, "app.js should read navigation from site data");
assert.match(appScript, /state\.data\?\.gallerySections/, "app.js should read gallery sections from site data");

assertSiteShape(createDefaultSiteData(), "server/defaultData.mjs");
assertSiteShape(await loadSeedSiteData("data/site-data.seed.json"), "data/site-data.seed.json");

const runtimeData = await readJsonIfPresent("data/site-data.json");
if (runtimeData) {
  assertSiteShape(runtimeData, "data/site-data.json");
}

console.log("Build check passed.");
