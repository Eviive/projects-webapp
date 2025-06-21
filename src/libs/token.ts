import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string) => {
    const tokenPayload = jwtDecode(token);

    if (!tokenPayload?.exp) {
        return true;
    }

    return Date.now() >= (tokenPayload.exp + 1) * 1000;
};
