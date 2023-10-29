import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
    ],
    safelist: [
        {
            pattern: /status-(\d){3}/
        }
    ],
    theme: {
        extend: {
            height: {
                "screen-dynamic": "100dvh"
            }
        }
    },
    darkMode: "class",
    plugins: [
        nextui()
    ]
};
