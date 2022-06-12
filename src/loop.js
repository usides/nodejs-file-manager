import { Transform, pipeline } from "stream";
import { chdir } from "process";
import { homedir } from "os";

import { printMessage, parseInput } from "./utils.js";
import { ls, up, cd, cat, add, rn, rm, cp } from "./commands/index.js";
import { input, output } from "./constants.js";

console.clear();

process.on("SIGINT", function () {
  printMessage({ type: "bye", preEOL: true, endEOL: false });
  process.exit();
});

chdir(homedir());
printMessage({ type: "welcome" });
printMessage({ type: "currentDir" });

const cliTransformer = new Transform({
  transform(chunk, _, callback) {
    callback(
      null,
      (() => {
        const [command, args] = parseInput(chunk.toString().trim());
        switch (command) {
          case "ls":
            ls(args);
            break;
          case "cl":
            console.clear();
            printMessage({ type: "currentDir" });
            break;
          case ".exit":
          case "exit":
            printMessage({ type: "bye" });
            process.exit();
          case "up":
            up(args);
            break;
          case "cd":
            cd(args);
            break;
          case "cat":
            cat(args);
            break;
          case "add":
            add(args);
            break;
          case "rn":
            rn(args);
            break;
          case "rm":
            rm(args);
            break;
          case "cp":
            cp(args, false);
            break;
          case "mv":
            cp(args, true);
            break;
          default:
            printMessage({ type: "invalid" });
            printMessage({ type: "currentDir" });
        }
      })()
    );
  },
});

pipeline(input, cliTransformer, output, (err) =>
  console.error("Pipeline failed.", err)
);
