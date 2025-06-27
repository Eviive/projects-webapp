import { queryClient } from "api/query-client";
import { App } from "App";
import { ErrorPage } from "pages/error";
import { createBrowserRouter } from "react-router";
import type { Authority } from "types/auth";

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "/",
                    lazy: async () => ({
                        Component: (await import("layouts/main")).Main
                    }),
                    HydrateFallback: () => null,
                    children: [
                        {
                            index: true,
                            lazy: async () => ({
                                Component: (await import("pages/home/home")).Home,
                                loader: (await import("pages/home/home.loader")).homeLoader(
                                    queryClient
                                )
                            }),
                            HydrateFallback: () => null
                        },
                        {
                            path: "/projects",
                            lazy: async () => {
                                const authorities: Authority[] = ["read:project"];
                                return {
                                    Component: (await import("pages/projects/projects")).Projects,
                                    loader: (
                                        await import("pages/projects/projects.loader")
                                    ).projectsLoader(queryClient, authorities),
                                    handle: {
                                        authorities
                                    }
                                };
                            },
                            HydrateFallback: () => null
                        },
                        {
                            path: "/skills",
                            lazy: async () => {
                                const authorities: Authority[] = ["read:skill"];
                                return {
                                    Component: (await import("pages/skills/skills")).Skills,
                                    loader: (
                                        await import("pages/skills/skills.loader")
                                    ).skillsLoader(queryClient, authorities),
                                    handle: {
                                        authorities
                                    }
                                };
                            },
                            HydrateFallback: () => null
                        },
                        {
                            path: "/health",
                            lazy: async () => {
                                const authorities: Authority[] = ["read:actuator"];
                                return {
                                    Component: (await import("pages/health/health")).Health,
                                    loader: (
                                        await import("pages/health/health.loader")
                                    ).healthLoader(queryClient, authorities),
                                    handle: {
                                        authorities
                                    }
                                };
                            },
                            HydrateFallback: () => null
                        }
                    ]
                },
                {
                    path: "/login",
                    lazy: async () => ({
                        Component: (await import("pages/login/login")).Login,
                        loader: (await import("pages/login/login.loader")).loginLoader
                    }),
                    HydrateFallback: () => null
                }
            ]
        }
    ],
    {
        basename: import.meta.env.VITE_ROUTER_BASE_URL
    }
);
