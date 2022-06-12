import { printMessage, buildPath } from "../utils.js";
import { rm as remove, lstat } from "fs/promises";

export const rm = async (args) => {
  try {
    if (args.length > 1)
      throw new Error("only one command argument is required");
    if (args.length < 1) throw new Error("path argument is required");
    const path = buildPath(args[0]);

    const stat = await lstat(path);
    if (stat.isDirectory())
      throw new Error(
        "first command argument should be a path to file, NOT the directory"
      );

    await remove(path);
  } catch (e) {
    printMessage({ type: "error", payload: e });
  } finally {
    printMessage({ type: "currentDir" });
  }
};
