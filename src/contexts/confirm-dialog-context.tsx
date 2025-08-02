import { ConfirmDialog } from "components/ui/confirm-dialog";
import type { FC, PropsWithChildren } from "react";
import { createContext, use, useRef, useState } from "react";

interface ConfirmDialogOpenState {
    open: true;
    title: string;
    body: string | null;
    confirmButton: string;
    confirmDanger?: boolean;
    cancelButton: string;
}

interface ConfirmDialogCloseState {
    open: false;
}

export type ConfirmDialogState = ConfirmDialogOpenState | ConfirmDialogCloseState;

type ConfirmDialogParams = Partial<Omit<ConfirmDialogOpenState, "open">>;

type IConfirmDialogContext = (params?: ConfirmDialogParams) => Promise<boolean>;

export const ConfirmDialogContext = createContext<IConfirmDialogContext | null>(null);

export const ConfirmDialogProvider: FC<PropsWithChildren> = ({ children }) => {
    const [dialogState, setDialogState] = useState<ConfirmDialogState>({
        open: false
    });

    const resolveRef = useRef<(resolve: boolean) => void>(null);

    const dialog = async (params?: ConfirmDialogParams) => {
        setDialogState({
            open: true,
            title: params?.title ?? "Are you sure?",
            body: params?.body ?? null,
            confirmButton: params?.confirmButton ?? "OK",
            confirmDanger: params?.confirmDanger ?? false,
            cancelButton: params?.cancelButton ?? "Cancel"
        });

        return new Promise<boolean>(resolve => {
            resolveRef.current = resolve;
        });
    };

    return (
        <ConfirmDialogContext value={dialog}>
            {children}
            <ConfirmDialog
                state={dialogState}
                handleClose={confirm => {
                    resolveRef.current?.(confirm);
                    setDialogState({ open: false });
                }}
            />
        </ConfirmDialogContext>
    );
};

export const useConfirmDialogContext = () => {
    const confirm = use(ConfirmDialogContext);
    if (confirm === null) {
        throw new Error("useConfirm called without ConfirmDialogContext");
    }
    return confirm;
};
