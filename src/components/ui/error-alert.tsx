import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import { getTitleAndDetail } from "libs/utils/error";
import type { FC } from "react";
import { LuCircleAlert } from "react-icons/lu";

interface Props {
    error: Error;
}

export const ErrorAlert: FC<Props> = ({ error }) => {
    const { title, detail } = getTitleAndDetail(error);

    return (
        <Alert variant="destructive">
            <LuCircleAlert className="size-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{detail}</AlertDescription>
        </Alert>
    );
};
