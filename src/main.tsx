import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { App } from "App";
import { Error as ErrorElement } from "components/common";
import { MainLayout } from "layouts";
import { Health, Home, Login, Projects } from "pages";
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
                element: <MainLayout />,
                children: [
                    {
                        path: "/",
                        element: <Home />,
                        index: true
                    },
                    {
                        path: "/projects",
                        element: <Projects />
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
], {
    basename: "/dashboard"
});

root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools></ReactQueryDevtools>
        </QueryClientProvider>
    </StrictMode>
);
