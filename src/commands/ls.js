import fs from "fs/promises";
import { cwd } from "process";
import { EOL } from "os";
import { printMessage } from "../utils.js";

export const ls = async (args) => {
  try {
    if (args.length)
      throw new Error("no arguments are required for this command");
    const data = await fs.readdir(cwd());
    const dataList = data.map((file, i) => `[${i + 1}] ${file}`).join(EOL);
    printMessage({ payload: dataList });
  } catch (e) {
    printMessage({ type: "error", payload: e });
  } finally {
    printMessage({ type: "currentDir" });
  }
};
