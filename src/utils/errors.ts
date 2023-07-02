import { AxiosError } from "axios";

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
            message: e.response?.data?.message ?? e.message
        };
    } else {
        titleAndMessage = {
            title: "Unknown error",
            message: "Please try again later."
        };
    }
    return titleAndMessage;
};
