import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertSiteData(data) {
  const requiredArrays = ["matches", "players", "news", "gallery", "sponsors"];
  if (!data || typeof data !== "object") {
    throw new Error("Site data must be an object.");
  }
  if (!data.team || typeof data.team.name !== "string") {
    throw new Error("Site data requires team.name.");
  }
  for (const key of requiredArrays) {
    if (!Array.isArray(data[key])) {
      throw new Error(`Site data requires ${key} array.`);
    }
  }
  if (!data.recruitment || !Array.isArray(data.recruitment.steps)) {
    throw new Error("Site data requires recruitment.steps array.");
  }
  if (data.applications && !Array.isArray(data.applications)) {
    throw new Error("Site data applications must be an array.");
  }
}

export function createDataStore({ dataFile, seedData }) {
  let memoryCache;

  async function ensureFile() {
    if (memoryCache) return;
    try {
      const raw = await readFile(dataFile, "utf8");
      memoryCache = JSON.parse(raw);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      memoryCache = clone(seedData);
      await persist(memoryCache);
    }
    if (!Array.isArray(memoryCache.applications)) {
      memoryCache.applications = [];
      await persist(memoryCache);
    }
    assertSiteData(memoryCache);
  }

  async function persist(data) {
    await mkdir(dirname(dataFile), { recursive: true });
    await writeFile(dataFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  }

  return {
    async read() {
      await ensureFile();
      return clone(memoryCache);
    },
    async write(nextData) {
      assertSiteData(nextData);
      memoryCache = clone(nextData);
      await persist(memoryCache);
      return clone(memoryCache);
    }
  };
}
