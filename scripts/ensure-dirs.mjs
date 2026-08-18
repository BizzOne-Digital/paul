import { mkdir } from "node:fs/promises";
import path from "node:path";

const categories = ["pages", "services", "blog", "settings"];
const root = path.join(process.cwd(), "public", "uploads");

for (const category of categories) {
  await mkdir(path.join(root, category), { recursive: true });
}

console.log("Upload directories ready:", root);
