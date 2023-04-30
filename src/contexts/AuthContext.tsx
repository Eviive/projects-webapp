import { createContext, Dispatch, SetStateAction, useContext } from "react";

type IAuthContext = {
    accessToken: string;
    setAccessToken: Dispatch<SetStateAction<string>>;
}

const AuthContext = createContext<IAuthContext>({
    accessToken: "",
    setAccessToken: () => console.warn("setAccessToken called without AuthContextProvider")
});

export const AuthContextProvider = AuthContext.Provider;

export const useAuthContext = () => useContext(AuthContext);
