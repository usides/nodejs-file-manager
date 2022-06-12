import { dirname } from "path";
import { fileURLToPath } from "url";

export const srcPath = dirname(fileURLToPath(import.meta.url));

export const input = process.stdin;
export const output = process.stdout;
