import { queryClient } from "api/query-client";
import { App } from "App";
import { initAuthContext } from "contexts/auth-context";
import { ErrorPage } from "pages/error";
import { healthLoader } from "pages/health/health.loader";
import { homeLoader } from "pages/home/home.loader";
import { projectsLoader } from "pages/projects/projects.loader";
import { skillsLoader } from "pages/skills/skills.loader";
import { createBrowserRouter } from "react-router-dom";

await initAuthContext();

export const router = createBrowserRouter(
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
                                const { Home } = await import("pages/home/home");
                                return { Component: Home };
                            },
                            loader: homeLoader(queryClient)
                        },
                        {
                            path: "/projects",
                            lazy: async () => {
                                const { Projects } = await import("pages/projects/projects");
                                return { Component: Projects };
                            },
                            loader: projectsLoader(queryClient)
                        },
                        {
                            path: "/skills",
                            lazy: async () => {
                                const { Skills } = await import("pages/skills/skills");
                                return { Component: Skills };
                            },
                            loader: skillsLoader(queryClient)
                        },
                        {
                            path: "/health",
                            lazy: async () => {
                                const { Health } = await import("pages/health/health");
                                return { Component: Health };
                            },
                            loader: healthLoader(queryClient)
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
