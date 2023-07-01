/// <reference types="vite/client" />

interface ImportMetaEnv {
	VITE_API_BASE_URL?: string;
	VITE_ROUTER_BASE_URL?: string;
}

interface ImportMeta {
	env: ImportMetaEnv;
}
