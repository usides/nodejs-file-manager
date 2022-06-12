import { printMessage, buildPath } from "../utils.js";
import { createReadStream } from "fs";
import { output } from "../constants.js";

export const cat = (args) => {
  try {
    if (args.length > 1)
      throw new Error("only one command argument is required");
    if (args.length < 1) throw new Error("path argument is required");
    const readStream = createReadStream(buildPath(args[0]), "utf-8");
    readStream.pipe(output);
    readStream.on("end", () => {
      printMessage({ type: "currentDir", preEOL: true });
    });
    readStream.on("error", (e) => {
      printMessage({ type: "error", payload: e });
      printMessage({ type: "currentDir" });
    });
  } catch (e) {
    printMessage({ type: "error", payload: e });
    printMessage({ type: "currentDir" });
  }
};
