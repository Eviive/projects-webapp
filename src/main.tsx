import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { App } from "App";
import { AuthContextProvider } from "contexts/AuthContext";
import { ThemeContextProvider } from "contexts/ThemeContext";
import { ErrorPage } from "pages/Error/ErrorPage";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const rootElement = document.querySelector("#root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnMount: "always",
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchInterval: false,
            refetchIntervalInBackground: false
        }
    }
});

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "/",
                    lazy: async () => {
                        const { MainLayout } = await import("layouts");
                        return { Component: MainLayout };
                    },
                    children: [
                        {
                            index: true,
                            lazy: async () => {
                                const { Home } = await import("pages/Home/Home");
                                return { Component: Home };
                            }
                        },
                        {
                            path: "/projects",
                            lazy: async () => {
                                const { Projects } = await import("pages/Projects/Projects");
                                return { Component: Projects };
                            }
                        },
                        {
                            path: "/skills",
                            lazy: async () => {
                                const { Skills } = await import("pages/Skills/Skills");
                                return { Component: Skills };
                            }
                        },
                        {
                            path: "/health",
                            lazy: async () => {
                                const { Health } = await import("pages/Health/Health");
                                return { Component: Health };
                            }
                        }
                    ]
                },
                {
                    path: "/login",
                    lazy: async () => {
                        const { Login } = await import("pages/Login/Login");
                        return { Component: Login };
                    }
                }
            ]
        }
    ],
    {
        basename: import.meta.env.VITE_ROUTER_BASE_URL
    }
);

root.render(
    <StrictMode>
        <ThemeContextProvider>
            <NextUIProvider className="min-h-screen min-h-screen-dynamic flex flex-col">
                <AuthContextProvider>
                    <QueryClientProvider client={queryClient}>
                        <RouterProvider router={router} />
                        <ReactQueryDevtools />
                    </QueryClientProvider>
                </AuthContextProvider>
            </NextUIProvider>
        </ThemeContextProvider>
    </StrictMode>
);
