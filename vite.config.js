import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

// https://vite.dev/config/
export default defineConfig({
	css: {
		postcss: {
			plugins: [tailwindcss, autoprefixer],
		},
	},
	plugins: [react()],
});
