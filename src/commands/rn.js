import { printMessage, buildPath } from "../utils.js";
import { rename, lstat, access } from "fs/promises";
import { basename, dirname } from "path";

export const rn = async (args) => {
  try {
    if (args.length > 2)
      throw new Error("only two command arguments are required");
    if (args.length < 2) throw new Error("two command arguments are required");
    if (args[1] !== basename(args[1]))
      throw new Error(
        "second command argument should be a valid name, NOT the path"
      );

    const path = buildPath(args[0]);
    const newPath = buildPath(dirname(path), args[1]);

    const stat = await lstat(path);
    if (stat.isDirectory())
      throw new Error(
        "first command argument should be a path to file, NOT the directory"
      );

    await access(newPath);
    throw new Error("file with this name exists, use another name");
  } catch (e) {
    if (e.syscall === "access" && e.code === "ENOENT") {
      await rename(args[0], buildPath(dirname(buildPath(args[0])), args[1]));
    } else {
      printMessage({ type: "error", payload: e });
    }
  } finally {
    printMessage({ type: "currentDir" });
  }
};
