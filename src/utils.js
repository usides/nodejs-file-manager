import { cwd, stdout, argv } from "process";
import { EOL } from "os";
import { resolve } from "path";

export const args = Object.fromEntries(
  argv.slice(2).map((arg) => arg.split("="))
);

export const buildPath = (...targets) => {
  return resolve(...targets);
};

export const parseInput = (chunk) => {
  const chunkArr = chunk.toString().trim().split(" ");
  const command = chunkArr[0];
  let args = chunkArr.slice(1);

  if (args.some((arg) => /"|'/g.test(arg))) {
    args = args
      .join(" ")
      .split(/["'] | ["']/)
      .map((arg) => arg.replace(/"|'/g, ""));
  }
  return [command, args];
};

export const printMessage = ({
  type,
  payload,
  endEOL = true,
  preEOL = false,
} = {}) => {
  switch (type) {
    case "currentDir":
      stdout.write(
        `${preEOL ? EOL : ""}You are currently in ${cwd()}${
          endEOL ? EOL : ""
        }> `
      );
      break;
    case "invalid":
      stdout.write(`Invalid input${endEOL ? EOL : ""}`);
      break;
    case "error":
      stdout.write(
        `Operation failed${payload ? `: ${payload}` : ""}${endEOL ? EOL : ""}`
      );
      break;
    case "welcome":
      stdout.write(
        `Welcome to the File Manager, ${args["--username"]}!${
          endEOL ? EOL : ""
        }`
      );
      break;
    case "bye":
      stdout.write(
        `${preEOL ? EOL : ""}Thank you for using File Manager, ${
          args["--username"]
        }!${endEOL ? EOL : ""}`
      );
      break;
    case "eol":
      stdout.write(EOL);
      break;

    default:
      stdout.write(`${preEOL ? EOL : ""}${payload ?? ""}${endEOL ? EOL : ""}`);
      break;
  }
};
