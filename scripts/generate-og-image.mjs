import sharp from 'sharp';

const outputPath = new URL('../public/assets/images/og-image.webp', import.meta.url).pathname;
const profilePath = new URL('../public/assets/images/profile.png', import.meta.url).pathname;

const width = 1200;
const height = 630;

const profile = await sharp(profilePath)
  .resize(280, 280, { fit: 'cover' })
  .png()
  .toBuffer();

const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e3a5f"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <text x="420" y="260" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="64" font-weight="700">Aqilzikry Arman</text>
  <text x="420" y="340" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="32">Software Engineer Portfolio</text>
  <text x="420" y="400" fill="#60a5fa" font-family="system-ui, sans-serif" font-size="24">aqilzikry.github.io</text>
</svg>`;

await sharp(Buffer.from(svg))
  .resize(width, height)
  .composite([{ input: profile, left: 80, top: 175 }])
  .webp({ quality: 85 })
  .toFile(outputPath);

console.log(`Created ${outputPath}`);
