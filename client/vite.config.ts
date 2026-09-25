import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

const API_TARGET = process.env.API_PROXY_TARGET || "http://localhost:3000";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/actions": API_TARGET,
      "/blobs": API_TARGET,
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
