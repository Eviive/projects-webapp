import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "components/ui/alert-dialog";
import type { ConfirmDialogState } from "contexts/confirm-dialog-context";
import type { FC } from "react";

type Props = {
    state: ConfirmDialogState;
    handleClose: (confirm: boolean) => void;
};

export const ConfirmDialog: FC<Props> = ({ state, handleClose }) => {
    return (
        <AlertDialog
            open={state.open}
            onOpenChange={open => {
                if (!open) handleClose(false);
                return;
            }}
        >
            <AlertDialogContent>
                {state.open && (
                    <>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{state.title}</AlertDialogTitle>
                            {!!state.body && (
                                <AlertDialogDescription>{state.body}</AlertDialogDescription>
                            )}
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{state.cancelButton}</AlertDialogCancel>
                            <AlertDialogAction
                                variant={state.confirmDanger ? "destructive" : undefined}
                                onClick={() => handleClose(true)}
                            >
                                {state.confirmButton}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </>
                )}
            </AlertDialogContent>
        </AlertDialog>
    );
};
