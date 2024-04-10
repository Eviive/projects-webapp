import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { App } from "App";
import { AuthContextProvider } from "contexts/auth-context";
import { ConfirmDialogProvider } from "contexts/confirm-dialog-context";
import { ThemeContextProvider } from "contexts/theme-context";
import { ErrorPage } from "pages/error";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const rootElement = document.querySelector("#root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);

const queryClient = new QueryClient();

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
                        const { Main } = await import("layouts/main");
                        return { Component: Main };
                    },
                    children: [
                        {
                            index: true,
                            lazy: async () => {
                                const { Home } = await import("pages/home");
                                return { Component: Home };
                            }
                        },
                        {
                            path: "/projects",
                            lazy: async () => {
                                const { Projects } = await import("pages/projects");
                                return { Component: Projects };
                            }
                        },
                        {
                            path: "/skills",
                            lazy: async () => {
                                const { Skills } = await import("pages/skills");
                                return { Component: Skills };
                            }
                        },
                        {
                            path: "/health",
                            lazy: async () => {
                                const { Health } = await import("pages/health");
                                return { Component: Health };
                            }
                        }
                    ]
                },
                {
                    path: "/login",
                    lazy: async () => {
                        const { Login } = await import("pages/login");
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
            <AuthContextProvider>
                <QueryClientProvider client={queryClient}>
                    <ConfirmDialogProvider>
                        <RouterProvider router={router} />
                    </ConfirmDialogProvider>
                    <ReactQueryDevtools />
                </QueryClientProvider>
            </AuthContextProvider>
        </ThemeContextProvider>
    </StrictMode>
);
