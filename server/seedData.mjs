import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createDefaultSiteData } from "./defaultData.mjs";

const ROOT_DIR = resolve(fileURLToPath(new URL("..", import.meta.url)));
const DEFAULT_SEED_FILE = join(ROOT_DIR, "data", "site-data.seed.json");

export async function loadSeedSiteData(seedFile = process.env.SEED_DATA_FILE || DEFAULT_SEED_FILE) {
  try {
    return JSON.parse(await readFile(seedFile, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return createDefaultSiteData();
  }
}
