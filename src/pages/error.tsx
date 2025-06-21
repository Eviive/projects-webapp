import { getDetail } from "libs/utils/error";
import type { FC } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";

export const ErrorPage: FC = () => {
    const error = useRouteError();

    return (
        <div>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{isRouteErrorResponse(error) ? error.statusText : getDetail(error)}</i>
            </p>
        </div>
    );
};
