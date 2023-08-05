import type { FC } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export const ErrorPage: FC = () => {

    const error = useRouteError();

    return (
        <div>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            {isRouteErrorResponse(error) &&
                <p>
                    <i>{error.statusText}</i>
                </p>
            }
        </div>
    );
};
