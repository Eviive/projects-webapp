import { queryOptions } from "@tanstack/react-query";
import { LoginOptionsService } from "api/services/login-options";
import { getAuthContext } from "contexts/auth-context";
import { isLoggedIn } from "libs/auth/authorities";
import { queryLoader } from "libs/loader/query-loader";
import { redirect } from "react-router";
import type { LoginOption } from "types/auth/login-options";
import type { QueryLoaderFunction } from "types/loader";

export const loginQueryOptions = queryOptions({
    queryKey: ["login-options"],
    queryFn: () => LoginOptionsService.findLoginOptions()
});

export const loginLoader: QueryLoaderFunction<LoginOption[] | Response | null> =
    qC =>
    ({ request }) => {
        const currentUser = getAuthContext().currentUser;

        if (!isLoggedIn(currentUser)) {
            return queryLoader(qC, loginQueryOptions);
        }

        const redirectPath = new URL(request.url).searchParams.get("redirect") ?? "/";

        return redirect(redirectPath);
    };
