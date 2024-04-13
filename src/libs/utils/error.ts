import { AxiosError } from "axios";

type TitleAndDetail = { title: string; detail: string };

export const getTitleAndDetail = (e: unknown): TitleAndDetail => {
    import.meta.env.PROD || console.error(e);

    if (e instanceof AxiosError) {
        return {
            title: e.response?.data?.title ?? e.name,
            detail: e.response?.data?.detail ?? e.message
        };
    } else if (e instanceof Error) {
        return {
            title: e.name,
            detail: e.message
        };
    } else {
        return {
            title: "Unknown error",
            detail: "Please contact an administrator if this error persists."
        };
    }
};

export const getDetail = (e: unknown): TitleAndDetail["detail"] => {
    return getTitleAndDetail(e).detail;
};
