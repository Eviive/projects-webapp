import { getAuthContext } from "contexts/auth-context";
import { hasEveryAuthority } from "libs/auth";
import { redirect } from "react-router";
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
        const currentUser = getAuthContext().currentUser;

        if (hasEveryAuthority(authorities, currentUser)) {
            return loader(args);
        }

        const url = new URL(args.request.url);

        const redirectPath = url.pathname;

        if (redirectPath.trim() === "") {
            return redirect("/login");
        }

        const searchParams = new URLSearchParams({
            redirect: redirectPath + url.search
        });

        return redirect(`/login?${searchParams.toString()}`);
    };
};

export const protectedQueryLoader = <D>(
    queryLoader: QueryLoaderFunction<D>
): ProtectedQueryLoaderFunction<D> => {
    return (queryClient, authorities) => protectedLoader(authorities, queryLoader(queryClient));
};
