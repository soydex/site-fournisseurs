import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root:'.',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
  },
  build: {
    outDir: "dist",
    minify: "terser",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
    target: "esnext",
    assetsDir: "assets",
  },
  base: "/",
  preview: {
    port: 4173,
    host: true,
    strictPort: true,
  },
});
