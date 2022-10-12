#!/usr/bin/env node

import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { setNpmScript, clearHookScriptsFromHusky } from "./utils.js";

const [, , ...args] = process.argv;

const hooksDir = args[0];
if (!hooksDir) {
  console.log("Usage: fuck-husky ./path/to/git/hooks/");
  process.exit(1);
}

const cwd = process.cwd();

const HOOKS_PATH = path.join(cwd, hooksDir);
const HUSKY_PATH = path.join(cwd, ".husky");

setNpmScript("prepare", `git config --local core.hooksPath ${hooksDir}`);

const huskyDirExists = existsSync(HUSKY_PATH);
if (huskyDirExists) {
  await clearHookScriptsFromHusky();
  await fs
    .rm(path.join(HUSKY_PATH, "_"), { force: true, recursive: true })
    .catch((err) => err);
  await fs.rename(HUSKY_PATH, HOOKS_PATH);
}
