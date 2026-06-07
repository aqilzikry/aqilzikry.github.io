![Status - WIP](https://img.shields.io/badge/Status-WIP-yellow)
[![Hosted with Github Pages](https://img.shields.io/badge/Hosted_with-GitHub_Pages-blue?logo=github&logoColor=white)](https://pages.github.com/)
[![Made with Astro](https://img.shields.io/badge/Astro-white?logo=astro&logoColor=purple)](https://astro.build/)

# Portfolio Website - Astro

Personal portfolio built with Astro 5 and Tailwind CSS. Update [`src/data/info.ts`](src/data/info.ts) for portfolio content and [`src/data/icons.ts`](src/data/icons.ts) for technology icons.

## Project Structure

```
/
├── public/
│   ├── assets/
│   │   ├── fonts/
│   │   └── images/
│   └── favicon.ico
├── scripts/
│   ├── optimize-images.mjs
│   └── generate-og-image.mjs
├── src/
│   ├── components/
│   │   ├── general/     # Navbar, Footer, ProjectCard, MetaHead
│   │   ├── home/        # Hero, Experience, Technologies
│   │   └── tools/       # Interactive utility widgets
│   ├── data/
│   │   ├── info.ts
│   │   └── icons.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── projects.astro
│   │   ├── tools.astro
│   │   └── 404.astro
│   ├── scripts/         # Shared client utilities
│   ├── styles/
│   │   ├── style.css
│   │   ├── custom-styles.css
│   │   └── fonts.css
│   ├── types/
│   └── utils/
└── package.json
```

## Commands

| Command | Action |
| :------ | :----- |
| `npm install` | Installs dependencies |
| `npm run dev` | Starts local dev server |
| `npm run build` | Builds production site to `./dist/` |
| `npm run preview` | Previews the production build |
| `npm run check` | Runs Astro type checking |
| `npm run optimize:images` | Compresses project screenshots |
| `npm run optimize:og` | Regenerates the OG image |
