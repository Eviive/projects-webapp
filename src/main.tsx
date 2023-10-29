import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { App } from "App";
import { ErrorPage } from "components/common";
import { AuthContextProvider } from "contexts/AuthContext";
import { MainLayout } from "layouts";
import { Health, Home, Login, Projects, Skills } from "pages";
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
                    element: <MainLayout />,
                    children: [
                        {
                            index: true,
                            element: <Home />
                        },
                        {
                            path: "/projects",
                            element: <Projects />
                        },
                        {
                            path: "/skills",
                            element: <Skills />
                        },
                        {
                            path: "/health",
                            element: <Health />
                        }
                    ]
                },
                {
                    path: "/login",
                    element: <Login />
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
        <NextUIProvider className="min-h-screen min-h-screen-dynamic flex flex-col">
            <AuthContextProvider>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
                    <ReactQueryDevtools></ReactQueryDevtools>
                </QueryClientProvider>
            </AuthContextProvider>
        </NextUIProvider>
    </StrictMode>
);
