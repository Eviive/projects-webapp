import { useAuthContext } from "contexts/auth-context";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const RequireAuth = (WrappedComponent: FC) => {
    const EnhancedComponent: FC = () => {
        const { accessToken } = useAuthContext();

        const navigate = useNavigate();

        const [ isAuthenticated, setIsAuthenticated ] = useState(false);

        useEffect(() => {
            if (accessToken) {
                setIsAuthenticated(true);
            } else {
                navigate("/login", { replace: true });
            }
        }, [ accessToken, navigate ]);

        return <>{isAuthenticated && <WrappedComponent />}</>;
    };

    EnhancedComponent.displayName = `RequireAuth(${WrappedComponent.displayName})`;

    return EnhancedComponent;
};
