import { AxiosError } from "axios";

export const getTitleAndMessage = (e: unknown): { title: string, message: string } => {
    import.meta.env.PROD || console.error(e);

    let titleAndMessage: { title: string, message: string | string[] };

    if (e instanceof AxiosError) {
        titleAndMessage = {
            title: e.response?.data?.error ?? e.name,
            message: e.response?.data?.message ?? e.message
        };
    } else if (e instanceof Error) {
        titleAndMessage = {
            title: e.name,
            message: e.message
        };
    } else {
        return {
            title: "Unknown error",
            message: "Please try again later."
        };
    }

    return {
        title: titleAndMessage.title,
        message: Array.isArray(titleAndMessage.message) ? titleAndMessage.message.join(" ") : titleAndMessage.message
    };
};

export const getFormattedTitleAndMessage = (e: unknown): string => {
    const { title, message } = getTitleAndMessage(e);
    return `${title}: ${message}`;
};
