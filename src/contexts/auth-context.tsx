import { useSyncExternalStore } from "react";
import type { CurrentUser } from "types/auth";

export interface IAuthContext {
    currentUser: CurrentUser;
    accessToken: string | null;
}

let authContext: IAuthContext | null = null;

export const getAuthContext = (): IAuthContext => {
    if (authContext === null) {
        throw new Error("The authContext has not been initialized");
    }

    return authContext;
};

export const setAuthContext = async (newAuthContext: IAuthContext) => {
    authContext = newAuthContext;
    notify();
};

type Listener = () => void;

const listeners: Listener[] = [];

const notify = () => {
    for (const listener of listeners) {
        listener();
    }
};

const subscribe = (listener: Listener): (() => void) => {
    listeners.push(listener);
    return () => {
        const index = listeners.indexOf(listener);
        listeners.splice(index, 1);
    };
};

export const useAuthContext = () => {
    return useSyncExternalStore(subscribe, getAuthContext);
};
