import { open } from "fs/promises";
import { printMessage, buildPath } from "../utils.js";

export const add = async (args) => {
  let filehandle;
  try {
    if (args.length > 1)
      throw new Error("only one command argument is required");
    if (args.length < 1) throw new Error("path argument is required");
    filehandle = await open(buildPath(args[0]), "wx");
  } catch (e) {
    printMessage({ type: "error", payload: e });
  } finally {
    printMessage({ type: "currentDir" });
    await filehandle?.close();
  }
};
