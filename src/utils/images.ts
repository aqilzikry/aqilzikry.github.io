import type { ImageMetadata } from 'astro';

export const projectImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpeg,jpg,png,gif}'
);
