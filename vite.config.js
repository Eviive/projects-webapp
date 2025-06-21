import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";
import viteTsconfigPaths from "vite-tsconfig-paths";

/** @type {import('vite').UserConfig} */
export default {
    plugins: [react(), viteTsconfigPaths(), tailwindcss(), eslint()],
    server: {
        port: 3001,
        open: true
    },
    preview: {
        port: 3000,
        open: true
    },
    build: {
        sourcemap: true
    },
    css: {
        modules: {
            generateScopedName: "[local]_[hash:base64:5]",
            localsConvention: "camelCaseOnly"
        }
    }
};
