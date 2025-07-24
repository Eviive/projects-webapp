import { request } from "api/client";
import { AxiosHeaders } from "axios";

const URL = "/logout";

const logout = async (): Promise<string | null> => {
    const res = await request(URL, {
        method: "POST",
        params: {
            post_logout_success_uri: "http://localhost:3001" // TODO: env
        }
    });

    const headers = res.headers;
    if (!(headers instanceof AxiosHeaders) || !headers.has("Location")) {
        return null;
    }

    const location = headers.get("Location");
    if (typeof location !== "string") {
        return null;
    }

    return location;
};

export const LogoutService = {
    logout
};
