import { getAuthContext } from "contexts/auth-context";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const RequireAuth = (WrappedComponent: FC) => {
    const EnhancedComponent: FC = () => {
        const navigate = useNavigate();

        const [isAuthenticated, setIsAuthenticated] = useState(false);

        useEffect(() => {
            if (getAuthContext().accessToken !== null) {
                setIsAuthenticated(true);
            } else {
                navigate("/login", { replace: true });
            }
        }, [navigate]);

        return <>{isAuthenticated && <WrappedComponent />}</>;
    };

    EnhancedComponent.displayName = `RequireAuth(${WrappedComponent.displayName})`;

    return EnhancedComponent;
};
