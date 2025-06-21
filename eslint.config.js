import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default defineConfig([
    globalIgnores([
        "**/node_modules/",
        "**/dist/",
        "vite.config.js",
        "eslint.config.js",
        "tailwind.config.js",
        "postcss.config.js"
    ]),

    js.configs.recommended,
    ts.configs.strictTypeChecked,
    ts.configs.stylisticTypeChecked,
    react.configs.flat.recommended,
    react.configs.flat["jsx-runtime"],
    reactHooks.configs["recommended-latest"],
    jsxA11y.flatConfigs.strict,
    eslintConfigPrettier,

    {
        languageOptions: {
            globals: {
                ...globals.browser
            },
            parserOptions: {
                projectService: true
            }
        },

        settings: {
            react: {
                version: "detect"
            }
        },

        rules: {
            "@typescript-eslint/consistent-type-imports": [
                "error",
                {
                    prefer: "type-imports",
                    fixStyle: "separate-type-imports"
                }
            ],
            "@typescript-eslint/consistent-type-exports": [
                "error",
                {
                    fixMixedExportsWithInlineTypeSpecifier: false
                }
            ],
            "react/self-closing-comp": [
                "error",
                {
                    component: true,
                    html: false
                }
            ],
            "react/no-unknown-property": [
                "error",
                {
                    ignore: ["vaul-drawer-wrapper", "cmdk-input-wrapper"]
                }
            ]
        }
    }
]);
