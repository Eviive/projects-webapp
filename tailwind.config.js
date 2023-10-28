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
            width: {
                "sidebar": "60px",
                "sidebar-expanded": "250px"
            },
            height: {
                "screen-dynamic": "100dvh",
                "sidebar-item": "60px"
            },
            spacing: {
                "sidebar": "60px"
            }
        }
    },
    darkMode: "class",
    plugins: [
        nextui()
    ]
};
