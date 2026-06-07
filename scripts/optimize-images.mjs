import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const imagesDir = new URL('../src/assets/images', import.meta.url).pathname;

const thumbnailFiles = new Set(['smartalgebra.png', 'myeasyprog.png']);

async function optimizeImage(filePath) {
  const fileName = path.basename(filePath);
  const isThumbnail = thumbnailFiles.has(fileName);
  const maxWidth = isThumbnail ? 800 : 1200;

  const image = sharp(filePath);
  const metadata = await image.metadata();

  if (!metadata.width || metadata.width <= maxWidth) {
    await image.png({ compressionLevel: 9, palette: true }).toFile(`${filePath}.tmp`);
  } else {
    await image
      .resize({ width: maxWidth, withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: true })
      .toFile(`${filePath}.tmp`);
  }

  await fs.rename(`${filePath}.tmp`, filePath);
  const stats = await fs.stat(filePath);
  console.log(`Optimized ${fileName}: ${(stats.size / 1024).toFixed(1)} KB`);
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (/\.png$/i.test(entry.name)) {
      await optimizeImage(fullPath);
    }
  }
}

await walk(imagesDir);
