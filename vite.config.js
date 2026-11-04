import { defineConfig } from "vite";

// Relative asset paths also work when GitHub Pages serves a repository subfolder.
export default defineConfig({ base: "./", esbuild: { jsx: "automatic" } });
