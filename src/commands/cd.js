import { chdir } from "process";
import { printMessage, buildPath } from "../utils.js";

export const cd = (args) => {
  try {
    if (args.length > 1)
      throw new Error("only one command argument is required");
    if (args.length < 1) throw new Error("path argument is required");
    chdir(buildPath(args[0]));
  } catch (e) {
    printMessage({ type: "error", payload: e });
  } finally {
    printMessage({ type: "currentDir" });
  }
};
