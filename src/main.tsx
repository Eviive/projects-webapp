import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { App } from "App";
import { Error as ErrorElement } from "components/common";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const rootElement = document.querySelector("#root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);

const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorElement />,
        children: [
            {
                path: "/",
                lazy: async () => ({ Component: (await import("layouts/Main/Main")).Main }),
                children: [
                    {
                        index: true,
                        lazy: async () => ({ Component: (await import("pages/Home/Home")).Home })
                    },
                    {
                        path: "/projects",
                        lazy: async () => ({ Component: (await import("pages/Projects/Projects")).Projects })
                    },
                    {
                        path: "/skills",
                        lazy: async () => ({ Component: (await import("pages/Skills/Skills")).Skills })
                    },
                    {
                        path: "/health",
                        lazy: async () => ({ Component: (await import("pages/Health/Health")).Health })
                    }
                ]
            },
            {
                path: "/login",
                lazy: async () => ({ Component: (await import("pages/Login/Login")).Login })
            }
        ]
    }
], {
    basename: import.meta.env.VITE_ROUTER_BASE_URL
});

root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools></ReactQueryDevtools>
        </QueryClientProvider>
    </StrictMode>
);
