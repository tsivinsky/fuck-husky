import cp from "child_process";

export function setNpmScript(scriptName = "", scriptValue = "") {
  const npmVersion = cp.execSync("npm -v", { encoding: "utf-8" });
  const [major] = npmVersion.split(".");

  if (+major < 8) {
    cp.execSync(`npm set-script ${scriptName} "${scriptValue}"`);
  } else {
    cp.execSync(`npm pkg set scripts.${scriptName}="${scriptValue}"`);
  }
}
