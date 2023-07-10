import { AxiosError } from "axios";
import { ErrorResponse } from "types/app";

type TitleAndMessage = {
    title: string;
    message: string;
};

export const getTitleAndMessage = (e: unknown): TitleAndMessage => {
    import.meta.env.PROD || console.error(e);
    let titleAndMessage: TitleAndMessage;
    if (e instanceof AxiosError) {
        titleAndMessage = {
            title: e.response?.data?.error ?? e.name,
            message: getMessage(e)
        };
    } else {
        titleAndMessage = {
            title: "Unknown error",
            message: "Please try again later."
        };
    }
    return titleAndMessage;
};

const getMessage = (e: AxiosError): string => {
    const data = e.response?.data as ErrorResponse | undefined;

    if (data?.message) {
        return Array.isArray(data.message)
            ? data.message.join("\n")
            : data.message;
    }

    return e.message;
};
