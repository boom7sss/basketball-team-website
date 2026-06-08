import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { loadSeedSiteData } from "../server/seedData.mjs";

test("deployment seed data carries the current designed site content", async () => {
  const current = JSON.parse(await readFile("data/site-data.json", "utf8"));
  const seed = await loadSeedSiteData("data/site-data.seed.json");

  assert.equal(seed.team.name, "人工智能篮球队");
  assert.equal(seed.team.contact.phone, "15281861950(wx)");
  assert.deepEqual(seed.team.training, current.team.training);
  assert.equal(seed.news[0].title, current.news[0].title);
  assert.equal(seed.players[0].photo, "/assets/players/player-24.webp");
  assert.equal(seed.gallery[0].source, "/assets/gallery/highlights/photos/highlight-photo-1.webp");
  assert.deepEqual(seed.applications, []);
});

test("seed loader falls back to built-in defaults when the deployment snapshot is missing", async () => {
  const dir = await mkdtemp(join(tmpdir(), "team-site-seed-"));
  try {
    const seed = await loadSeedSiteData(join(dir, "missing-seed.json"));

    assert.equal(seed.team.name, "人工智能篮球队");
    assert.ok(seed.players.length >= 3);
    assert.ok(Array.isArray(seed.gallery));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
