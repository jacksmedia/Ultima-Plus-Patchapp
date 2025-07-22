import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
// import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    reactRouter()
  ]
}); 