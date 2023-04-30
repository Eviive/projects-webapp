import { Error as ErrorElement } from "components/common";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Health, Home, Login, Projects, Users } from "pages";
import { Main } from "components/common";

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
                element: <Main />,
                children: [
                    {
                        path: "/",
                        element: <Home />
                    },
                    {
                        path: "/projects",
                        element: <Projects />
                    },
                    {
                        path: "/users",
                        element: <Users />
                    },
                    {
                        path: "health",
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
]);

root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools></ReactQueryDevtools>
        </QueryClientProvider>
    </StrictMode>
);
