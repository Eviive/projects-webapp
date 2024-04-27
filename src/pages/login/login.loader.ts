import { authContext } from "contexts/auth-context";
import { redirect } from "react-router-dom";
import type { LoaderFunction } from "types/loader";

export const loginLoader: LoaderFunction<Response | null> = ({ request }) => {
    if (authContext.accessToken === null) {
        return null;
    }

    const redirectPath = new URL(request.url).searchParams.get("redirect") ?? "/";

    return redirect(redirectPath);
};
