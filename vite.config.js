import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: '/',
    plugins: [react()],
    server: {
        port: 3069,
        proxy: {
            "/api": {
                target: "http://localhost:5069",
                changeOrigin: true,
                secure: false,
            },
        },
    }
});