import { printMessage, buildPath } from "../utils.js";
import { createReadStream, createWriteStream } from "fs";
import { lstat, rm, access } from "fs/promises";
import { basename } from "path";

export const cp = async (args, isDeleteOrigin) => {
  try {
    if (args.length > 2)
      throw new Error("only two command arguments are required");
    if (args.length < 2) throw new Error("two command arguments are required");

    const origin = buildPath(args[0]);
    const destination = buildPath(args[1]);

    await access(origin);

    const stat = await lstat(destination);
    if (!stat.isDirectory()) {
      throw new Error(
        "second command argument should be a path to directory, NOT the file"
      );
    } else {
      const readStream = createReadStream(origin);
      const writeStream = createWriteStream(
        buildPath(destination, basename(origin)),
        { flags: "wx" }
      );

      readStream.on("error", (e) => {
        printMessage({ type: "error", payload: e });
        printMessage({ type: "currentDir" });
      });

      writeStream.on("error", (e) => {
        printMessage({ type: "error", payload: e });
        printMessage({ type: "currentDir" });
      });

      writeStream.on("close", async () => {
        if (isDeleteOrigin) await rm(origin);
        printMessage({ type: "currentDir" });
      });

      readStream.pipe(writeStream);
    }
  } catch (e) {
    printMessage({ type: "error", payload: e });
    printMessage({ type: "currentDir" });
  }
};
