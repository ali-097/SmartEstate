import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0", // Allow access from any IP
    port: 5173, // Ensure this is the port you're using
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        secure: false,
      },
      "/modelsapi": {
        target: "http://localhost:5000",
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/modelsapi/, ""),
      },
    },
  },

  plugins: [react(), mkcert()],
});
