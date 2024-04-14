import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), svgr()],
  resolve: {
    alias: [
      {
        find: "@app",
        replacement: fileURLToPath(new URL("./src/app/", import.meta.url)),
      },
      {
        find: "@pages",
        replacement: fileURLToPath(new URL("./src/pages", import.meta.url)),
      },
      {
        find: "@widgets",
        replacement: fileURLToPath(new URL("./src/widgets/", import.meta.url)),
      },
      {
        find: "@features",
        replacement: fileURLToPath(new URL("./src/features", import.meta.url)),
      },
      {
        find: "@entities",
        replacement: fileURLToPath(new URL("./src/entities", import.meta.url)),
      },
      {
        find: "@shared",
        replacement: fileURLToPath(new URL("./src/shared", import.meta.url)),
      },
    ],
  }
})
