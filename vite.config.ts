import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => ({
    plugins: [
        react(),
        viteTsconfigPaths(),
        eslint()
    ],
    server: {
        port: 3001,
        open: true
    },
    preview: {
        port: 3000,
        open: true
    },
    css: {
        modules: {
            generateScopedName: "[local]_[hash:base64:5]",
            localsConvention: "camelCaseOnly"
        }
    }
}));
