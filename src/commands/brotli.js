import { printMessage, buildPath } from "../utils.js";
import { createReadStream, createWriteStream } from "fs";
import { lstat, rm, access } from "fs/promises";
import { basename } from "path";
import { createBrotliCompress, createBrotliDecompress } from "zlib";
import { pipeline } from "stream";

export const brotli = async (args, compress) => {
  try {
    if (args.length > 2)
      throw new Error("only two command arguments are required");
    if (args.length < 2) throw new Error("two command arguments are required");

    const origin = buildPath(args[0]);
    const destination = buildPath(args[1]);

    await access(origin);

    const stat = await lstat(destination);
    if (!stat.isDirectory())
      throw new Error(
        "second command argument should be a path to directory, NOT the file"
      );

    const getPathWithExtension = (compress) => {
      const name = compress
        ? `${basename(origin)}.br`
        : basename(origin).split(".").slice(0, -1).join(".");
      return buildPath(destination, name || `${basename(origin)}.decompressed`);
    };

    const readStream = createReadStream(origin);
    const writeStream = createWriteStream(getPathWithExtension(compress), {
      flags: "wx",
    });
    const brotli = compress ? createBrotliCompress() : createBrotliDecompress();

    pipeline(readStream, brotli, writeStream, async (err) => {
      if (err) {
        if (err.message === "Decompression failed") {
          await rm(getPathWithExtension(compress));
        }
        printMessage({ type: "error", payload: err });
        printMessage({ type: "currentDir" });
      } else {
        printMessage({ type: "currentDir" });
      }
    });
  } catch (e) {
    printMessage({ type: "error", payload: e });
    printMessage({ type: "currentDir" });
  }
};
