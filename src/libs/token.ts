import { jwtDecode } from "jwt-decode";
import { getDetail } from "libs/utils/error";
import type { TokenPayload } from "types/auth";

export const decodeToken = (token: string): TokenPayload | null => {
    try {
        return jwtDecode<TokenPayload>(token);
    } catch (e) {
        console.error("Error while decoding token:", getDetail(e));
        return null;
    }
};

export const isTokenExpired = (token: string) => {
    const tokenPayload = decodeToken(token);

    if (!tokenPayload || !tokenPayload.exp) {
        return true;
    }

    return Date.now() >= (tokenPayload.exp + 1) * 1000;
};
