import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import viteTsconfigPaths from "vite-tsconfig-paths";

/** @type {Partial<import("babel-plugin-react-compiler").PluginOptions>} */
const ReactCompilerConfig = {};

/** @type {import("vite").UserConfig} */
export default {
    plugins: [
        react({
            babel: {
                plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]]
            }
        }),
        viteTsconfigPaths(),
        tailwindcss(),
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
    build: {
        target: "ESNext",
        sourcemap: true
    },
    css: {
        modules: {
            generateScopedName: "[local]_[hash:base64:5]",
            localsConvention: "camelCaseOnly"
        }
    }
};
