import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "api/query-client";
import { ConfirmDialogProvider } from "contexts/confirm-dialog-context";
import { ThemeContextProvider } from "contexts/theme-context";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "router";

const rootElement = document.querySelector("#root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <ThemeContextProvider>
            <QueryClientProvider client={queryClient}>
                <ConfirmDialogProvider>
                    <RouterProvider router={router} />
                </ConfirmDialogProvider>
                <ReactQueryDevtools />
            </QueryClientProvider>
        </ThemeContextProvider>
    </StrictMode>
);
