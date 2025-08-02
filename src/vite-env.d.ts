/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_BASE_URL: string;
    VITE_AZURE_ASSETS_BASE_URL: string;
}

interface ImportMeta {
    env: ImportMetaEnv;
}
