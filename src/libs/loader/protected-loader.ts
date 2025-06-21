import { hasEveryAuthority } from "libs/auth";
import { redirect } from "react-router-dom";
import type { Authority } from "types/auth";
import type {
    LoaderFunction,
    ProtectedLoaderFunction,
    ProtectedQueryLoaderFunction,
    QueryLoaderFunction
} from "types/loader";

export const protectedLoader = <D>(
    authorities: Authority[],
    loader: LoaderFunction<D>
): ProtectedLoaderFunction<D> => {
    return async args => {
        if (hasEveryAuthority(authorities)) {
            return loader(args);
        }

        const routerBaseUrl = import.meta.env.VITE_ROUTER_BASE_URL;
        let redirectPath = new URL(args.request.url).pathname;

        if (routerBaseUrl && redirectPath.startsWith(routerBaseUrl)) {
            redirectPath = redirectPath.substring(routerBaseUrl.length);
        }

        if (redirectPath.trim() === "") {
            return redirect("/login");
        }

        const searchParams = new URLSearchParams();

        searchParams.set("redirect", redirectPath);

        return redirect(`/login?${searchParams.toString()}`);
    };
};

export const protectedQueryLoader = <D>(
    queryLoader: QueryLoaderFunction<D>
): ProtectedQueryLoaderFunction<D> => {
    return (queryClient, authorities) => protectedLoader(authorities, queryLoader(queryClient));
};
