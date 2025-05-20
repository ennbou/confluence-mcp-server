import { promises as fs } from "fs";
import path from "path";

export async function saveAttachment(
  data: Buffer,
  fileName: string,
  outputDir = "./attachments"
): Promise<string> {
  const dirPath = path.resolve(outputDir);
  await fs.mkdir(dirPath, { recursive: true });
  const filePath = path.join(dirPath, fileName);
  await fs.writeFile(filePath, data);
  return filePath;
}

export function extractFileNameFromUrl(url: string): string {
  const name = path.basename(new URL(url).pathname);
  return name;
}