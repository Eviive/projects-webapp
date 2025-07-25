import { getAuthContext } from "contexts/auth-context";
import { isLoggedIn } from "libs/auth";
import { redirect } from "react-router";
import type { LoaderFunction } from "types/loader";

export const loginLoader: LoaderFunction<Response | null> = ({ request }) => {
    const currentUser = getAuthContext().currentUser;

    if (!isLoggedIn(currentUser)) {
        return null;
    }

    const redirectPath = new URL(request.url).searchParams.get("redirect") ?? "/";

    return redirect(redirectPath);
};
