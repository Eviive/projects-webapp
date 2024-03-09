import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { App } from "App";
import { ErrorPage } from "components/common";
import { AuthContextProvider } from "contexts/AuthContext";
import { MainLayout } from "layouts";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeContextProvider } from "./contexts/ThemeContext";

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
                    element: <MainLayout />,
                    children: [
                        {
                            index: true,
                            lazy: async () => {
                                const { Home } = await import("pages/dashboard");
                                return { Component: Home };
                            }
                        },
                        {
                            path: "/projects",
                            lazy: async () => {
                                const { Projects } = await import("pages/dashboard");
                                return { Component: Projects };
                            }
                        },
                        {
                            path: "/skills",
                            lazy: async () => {
                                const { Skills } = await import("pages/dashboard");
                                return { Component: Skills };
                            }
                        },
                        {
                            path: "/health",
                            lazy: async () => {
                                const { Health } = await import("pages/dashboard");
                                return { Component: Health };
                            }
                        }
                    ]
                },
                {
                    path: "/login",
                    lazy: async () => {
                        const { Login } = await import("pages/auth");
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
            <div className="min-h-screen min-h-screen-dynamic flex flex-col">
                <AuthContextProvider>
                    <QueryClientProvider client={queryClient}>
                        <RouterProvider router={router} />
                        <ReactQueryDevtools />
                    </QueryClientProvider>
                </AuthContextProvider>
            </div>
        </ThemeContextProvider>
    </StrictMode>
);
