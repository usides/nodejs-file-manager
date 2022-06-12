import { printMessage, buildPath } from "../utils.js";
import { createReadStream, createWriteStream } from "fs";
import { rm } from "fs/promises";

export const cp = (args, isDeleteOrigin) => {
  try {
    if (args.length > 2)
      throw new Error("only two command arguments are required");
    if (args.length < 2) throw new Error("two command arguments are required");

    const origin = buildPath(args[0]);
    const destination = buildPath(args[1]);

    const readStream = createReadStream(origin);
    const writeStream = createWriteStream(destination, { flags: "wx" });

    readStream.on("end", async () => {
      if (isDeleteOrigin) await rm(origin);
      printMessage({ type: "currentDir" });
    });

    readStream.on("error", (e) => {
      printMessage({ type: "error", payload: e });
      printMessage({ type: "currentDir" });
    });

    writeStream.on("error", (e) => {
      printMessage({ type: "error", payload: e });
      printMessage({ type: "currentDir" });
    });

    readStream.pipe(writeStream);
  } catch (e) {
    printMessage({ type: "error", payload: e });
    printMessage({ type: "currentDir" });
  }
};
