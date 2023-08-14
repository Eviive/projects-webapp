import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";

type IAuthContext = {
    accessToken: string;
    setAccessToken: Dispatch<SetStateAction<string>>;
};

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthContextProvider = AuthContext.Provider;

export const useAuthContext = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error("useAuthContext called without AuthContextProvider");
    }
    return authContext;
};
