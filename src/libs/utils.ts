import { AxiosError } from "axios";
import type { Falsy } from "types/utils";

const isNotFalsy = <V>(value: V | Falsy): value is V => Number.isNaN(value) ? false : !!value;

export const formatClassNames = (...classNames: (string | Falsy)[]) => classNames.filter(isNotFalsy).join(" ");

export const getTitleAndMessage = (e: unknown): string => {
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
        titleAndMessage = {
            title: "Unknown error",
            message: "Please try again later."
        };
    }

    return `${titleAndMessage.title}: ${Array.isArray(titleAndMessage.message) ? titleAndMessage.message.join(" ") : titleAndMessage.message}`;
};
