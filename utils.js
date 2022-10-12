import cp from "child_process";
import fs from "fs/promises";
import path from "path";

export function setNpmScript(scriptName = "", scriptValue = "") {
  const npmVersion = cp.execSync("npm -v", { encoding: "utf-8" });
  const [major] = npmVersion.split(".");

  if (+major < 8) {
    cp.execSync(`npm set-script ${scriptName} "${scriptValue}"`);
  } else {
    cp.execSync(`npm pkg set scripts.${scriptName}="${scriptValue}"`);
  }
}

export async function clearHookScriptsFromHusky() {
  const huskyDir = path.join(process.cwd(), ".husky");
  const files = await fs.readdir(huskyDir);

  for (const file of files) {
    try {
      const pathToFile = path.join(huskyDir, file);

      const data = await fs.readFile(pathToFile, {
        encoding: "utf-8",
      });
      const newData = data
        .split("\n")
        .filter((line) => !/husky\.sh/.test(line))
        .join("\n");

      await fs.writeFile(pathToFile, newData, {
        encoding: "utf-8",
      });
    } catch (err) {
      continue;
    }
  }
}
