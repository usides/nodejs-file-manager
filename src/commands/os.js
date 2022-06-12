import { printMessage, buildPath } from "../utils.js";
import { rm as remove, lstat, access } from "fs/promises";
import { basename, dirname } from "path";
import { EOL, cpus, arch, homedir, userInfo } from "os";

export const os = async (args) => {
  try {
    if (args.length > 1)
      throw new Error("only one command argument is required");
    if (args.length < 1)
      throw new Error(
        "command argument is required, possible arguments: --EOL, --cpus, --homedir, --username, --architecture"
      );
    switch (args[0]) {
      case "--EOL":
        printMessage({ payload: JSON.stringify(EOL) });
        break;
      case "--cpus":
        const cpuAmountStr = `Overall amount of CPUS: ${cpus().length}${EOL}`;
        const cpuStr = cpus()
          .map((cpu, i) => {
            const speed = cpu.speed / 1000;
            return `[${i + 1}] model: ${cpu.model}, clock rate(GHz): ${speed} `;
          })
          .join(EOL);
        const output = `${cpuAmountStr}${cpuStr}`;
        printMessage({ payload: output });
        break;
      case "--homedir":
        printMessage({ payload: homedir() });
        break;
      case "--username":
        printMessage({ payload: userInfo().username });
        break;
      case "--architecture":
        printMessage({ payload: arch() });
        break;
      default:
        throw new Error(
          "command argument is wrong, possible arguments: --EOL, --cpus, --homedir, --username, --architecture "
        );
    }
  } catch (e) {
    printMessage({ type: "error", payload: e });
  } finally {
    printMessage({ type: "currentDir" });
  }
};
