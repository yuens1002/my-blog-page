import fs from 'fs/promises';
import fullFs from 'fs';
import path from 'path';
import PostError from './processPostError';

const linkPath = 'uploadedImages';

function setImageFileName(fileName: string): string {
  console.log('crypto called');
  const ext = path.extname(fileName);
  return `${crypto.randomUUID()}-${fileName.slice(0, 8)}${ext}`;
}

export async function processUploadedImage(imageFile: File) {
  const __projectRoot = process.cwd();
  if (!fullFs.existsSync(`${__projectRoot}/public/${linkPath}/`)) {
    fs.mkdir(`${__projectRoot}/public/${linkPath}`);
  }
  const fileName = setImageFileName(imageFile.name);
  const fsImagePath = `${__projectRoot}/public/${linkPath}/${fileName}`;
  try {
    await fs.writeFile(
      fsImagePath,
      Buffer.from(await imageFile.arrayBuffer())
    );
    return `/${linkPath}/${fileName}`;
  } catch (error) {
    console.error(error);
    throw new PostError({
      type: 'text',
      message: 'Failed to save image',
    });
  }
}

export function deleteUploadedImage(imageURL: string) {
  const __projectRoot = process.cwd();
  const imagePath = `${__projectRoot}/public${imageURL}`;
  fullFs.unlink(imagePath, (err) => {
    if (err) {
      console.error(err);
      throw new PostError({
        type: 'text',
        message: 'Failed to delete image',
      });
    }
  });
}
