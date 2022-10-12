#!/usr/bin/env node

import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { setNpmScript } from "./utils.js";

const [, , ...args] = process.argv;

const hooksDir = args[0];
if (!hooksDir) {
  console.log("Usage: fuck-husky ./path/to/git/hooks/");
  process.exit(1);
}

const cwd = process.cwd();

const HOOKS_PATH = path.join(cwd, hooksDir);
const HUSKY_PATH = path.join(cwd, ".husky");

const dirExists = existsSync(HOOKS_PATH);
if (!dirExists) {
  await fs.mkdir(HOOKS_PATH);
}

setNpmScript("prepare", `git config --local core.hooksPath ${hooksDir}`);

const huskyDirExists = existsSync(HUSKY_PATH);
if (huskyDirExists) {
  await fs.rename(HUSKY_PATH, HOOKS_PATH);
  await fs.rmdir(path.join(HUSKY_PATH, "_")).catch((err) => err);
}
