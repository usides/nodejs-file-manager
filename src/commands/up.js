import { chdir } from "process";
import { printMessage, buildPath } from "../utils.js";

export const up = (args) => {
  try {
    if (args.length)
      throw new Error("no arguments are required for this command");
    chdir(buildPath("../"));
  } catch (e) {
    printMessage({ type: "error", payload: e });
  } finally {
    printMessage({ type: "currentDir" });
  }
};
