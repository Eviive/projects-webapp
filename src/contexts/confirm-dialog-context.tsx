import { ConfirmDialog } from "components/ui/confirm-dialog";
import {
    createContext,
    type FC,
    type PropsWithChildren,
    useCallback,
    useContext,
    useRef,
    useState
} from "react";

type ConfirmDialogOpenState = {
    open: true;
    title: string;
    body: string | null;
    confirmButton: string;
    confirmDanger?: boolean;
    cancelButton: string;
};

type ConfirmDialogCloseState = {
    open: false;
};

export type ConfirmDialogState = ConfirmDialogOpenState | ConfirmDialogCloseState;

type ConfirmDialogParams = Partial<Omit<ConfirmDialogOpenState, "open">>;

type IConfirmDialogContext = (params?: ConfirmDialogParams) => Promise<boolean>;

export const ConfirmDialogContext = createContext<IConfirmDialogContext | null>(null);

export const ConfirmDialogProvider: FC<PropsWithChildren> = ({ children }) => {
    const [dialogState, setDialogState] = useState<ConfirmDialogState>({
        open: false
    });

    const resolveRef = useRef<(resolve: boolean) => void>();

    const dialog = useCallback(async (params?: ConfirmDialogParams) => {
        setDialogState({
            open: true,
            title: params?.title ?? "Are you sure?",
            body: params?.body ?? null,
            confirmButton: params?.confirmButton ?? "OK",
            cancelButton: params?.cancelButton ?? "Cancel"
        });

        return new Promise<boolean>(resolve => {
            resolveRef.current = resolve;
        });
    }, []);

    return (
        <ConfirmDialogContext.Provider value={dialog}>
            {children}
            <ConfirmDialog
                state={dialogState}
                handleClose={confirm => {
                    resolveRef.current?.(confirm);
                    setDialogState({ open: false });
                }}
            />
        </ConfirmDialogContext.Provider>
    );
};

export const useConfirmDialogContext = () => {
    const confirm = useContext(ConfirmDialogContext);
    if (confirm === null) {
        throw new Error("useConfirm called without ConfirmDialogContext");
    }
    return confirm;
};
