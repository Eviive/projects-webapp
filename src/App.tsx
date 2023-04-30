import { FC, useState } from "react";
import { AuthContextProvider } from "contexts/AuthContext";
import { Outlet } from "react-router-dom";

import "styles/reset.scss";

export const App: FC = () => {

    const [ accessToken, setAccessToken ] = useState("");

    return (
        <AuthContextProvider value={{
            accessToken,
            setAccessToken
        }}>
            <Outlet />
        </AuthContextProvider>
    );
};
