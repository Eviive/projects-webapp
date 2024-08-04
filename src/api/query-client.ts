import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30 * 1000
            // retry: (failureCount, error) => {
            //     console.log(failureCount, error);
            //     return failureCount < 3;
            // }
        }
    }
});
