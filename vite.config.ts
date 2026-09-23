import { defineConfig } from "vite";

export default defineConfig({
  // Relative base so the build works on GitHub Pages, Netlify, Vercel or any sub-folder
  base: "./",
  build: {
    target: "es2020",
    cssCodeSplit: false,
    assetsInlineLimit: 2048,
  },
});
