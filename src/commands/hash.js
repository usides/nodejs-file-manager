import { printMessage, buildPath } from "../utils.js";
import { createHash } from "crypto";
import { createReadStream } from "fs";

export const hash = (args) => {
  try {
    if (args.length > 1)
      throw new Error("only one command argument is required");
    if (args.length < 1) throw new Error("path argument is required");
    const path = buildPath(args[0]);

    const readStream = createReadStream(path);
    const hash = createHash("sha256");
    hash.setEncoding("hex");

    readStream.on("end", () => {
      hash.end();
      printMessage({ payload: hash.read() });
      printMessage({ type: "currentDir" });
    });

    readStream.on("error", (e) => {
      printMessage({ type: "error", payload: e });
      printMessage({ type: "currentDir" });
    });

    hash.on("error", (e) => {
      printMessage({ type: "error", payload: e });
      printMessage({ type: "currentDir" });
    });

    readStream.pipe(hash);
  } catch (e) {
    printMessage({ type: "error", payload: e });
    printMessage({ type: "currentDir" });
  }
};
