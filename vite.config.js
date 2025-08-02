import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint2";
import viteTsconfigPaths from "vite-tsconfig-paths";

/** @type {Partial<import("babel-plugin-react-compiler").PluginOptions>} */
const ReactCompilerConfig = {};

/** @type {import("vite").CommonServerOptions} */
const commonServerOptions = {
    port: 3001,
    open: true,
    proxy: {
        "^/(api|oauth2|logout|v2/api-docs|v3/api-docs|swagger-resources|configuration/ui|configuration/security|webjars|swagger-ui)(.*)?$":
            "http://localhost:8081",
        "^/login/.+$": "http://localhost:8081"
    }
};

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
    server: commonServerOptions,
    preview: commonServerOptions,
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
