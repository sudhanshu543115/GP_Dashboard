import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "axios",
      "recharts",
      "lucide-react",
      "framer-motion"
    ]
  },

  build: {
    sourcemap: false,
    minify: "esbuild",
    chunkSizeWarningLimit: 2000,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@react-pdf") || id.includes("pdfjs") || id.includes("jspdf")) {
              return "vendor-pdf";
            }
            if (id.includes("recharts") || id.includes("d3")) {
              return "vendor-charts";
            }
            if (id.includes("framer-motion") || id.includes("lucide-react")) {
              return "vendor-ui";
            }
            return "vendor"; // all other node_modules into one chunk
          }
        }
      }
    }
  }
});