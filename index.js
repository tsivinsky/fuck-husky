import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { setNpmScript } from "./utils.js";
import { __dirname } from "./constants.js";

const [, , ...args] = process.argv;

const hooksDir = args[0];
if (!hooksDir) {
  console.log("Usage: fuck-husky ./path/to/git/hooks/");
  process.exit(1);
}

const HOOKS_PATH = path.join(__dirname, hooksDir);
const HUSKY_PATH = path.join(__dirname, ".husky");

const dirExists = existsSync(HOOKS_PATH);
if (!dirExists) {
  await fs.mkdir(HOOKS_PATH);
}

setNpmScript("prepare", `git config --local core.hooksPath ${hooksDir}`);

const huskyDirExists = existsSync(HUSKY_PATH);
if (huskyDirExists) {
  await fs.rename(HUSKY_PATH, HOOKS_PATH);
  await fs.rmdir(path.join(HUSKY_PATH, "_"));
}
