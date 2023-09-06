import type { Dispatch, FC, PropsWithChildren, SetStateAction } from "react";
import { createContext, useContext, useMemo, useState } from "react";

type IAuthContext = {
    accessToken: string;
    setAccessToken: Dispatch<SetStateAction<string>>;
};

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {

    const [ accessToken, setAccessToken ] = useState("");

    const authContextValue = useMemo<IAuthContext>(() => ({
        accessToken,
        setAccessToken
    }), [ accessToken ]);

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): IAuthContext => {
    const authContext = useContext(AuthContext);
    if (authContext === null) {
        throw new Error("useAuthContext called without AuthContextProvider");
    }
    return authContext;
};
