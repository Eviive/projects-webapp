import { FC } from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export const Error: FC = () => {

    const error = useRouteError();

    return (
        <>
            {/*<Header />*/}
            <div>
                <h1>Oops!</h1>
                <p>Sorry, an unexpected error has occurred.</p>
                {isRouteErrorResponse(error) &&
                    <p>
                        <i>{error.statusText}</i>
                    </p>
                }
            </div>
        </>
    );
};
