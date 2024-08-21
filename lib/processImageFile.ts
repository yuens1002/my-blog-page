import fs from 'fs/promises';
import fullFs from 'fs';
import path from 'path';

function setImageFileName(fileName: string): string {
  const ext = path.extname(fileName);
  return `${crypto.randomUUID()}-${fileName.slice(0, 8)}${ext}`;
}

export function setNextImagePath(fileName: string): string {
  const name = setImageFileName(fileName);
  return `/uploadedImage/${name}`;
}

export async function processUploadedImage(imageFile: File) {
  const __projectRoot = process.cwd();
  if (!fullFs.existsSync(`${__projectRoot}/public/uploadedImages/`)) {
    fs.mkdir(`${__projectRoot}/public/uploadedImages`);
  }
  const fsImagePath = `${__projectRoot}/public/uploadedImages/${setImageFileName(
    imageFile.name
  )}`;
  await fs.writeFile(
    fsImagePath,
    Buffer.from(await imageFile.arrayBuffer())
  );
}
