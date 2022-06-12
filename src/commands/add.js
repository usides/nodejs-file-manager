import { open } from "fs/promises";
import { printMessage, buildPath } from "../utils.js";
import { basename, dirname } from "path";
import { cwd } from "process";

export const add = async (args) => {
  let filehandle;
  try {
    if (args.length > 1)
      throw new Error("only one command argument is required");
    if (args.length < 1) throw new Error("command argument is required");

    if (args[0] !== basename(args[0]))
      throw new Error("command argument should be a valid name, NOT the path");

    filehandle = await open(buildPath(cwd(), args[0]), "wx");
  } catch (e) {
    printMessage({ type: "error", payload: e });
  } finally {
    printMessage({ type: "currentDir" });
    await filehandle?.close();
  }
};
