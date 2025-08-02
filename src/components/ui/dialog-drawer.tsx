import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "components/ui/drawer";
import { useIsMobile } from "hooks/use-mobile";
import type { FC, ReactNode } from "react";

interface Props {
    trigger: ReactNode;
    header: {
        title: ReactNode;
        description: ReactNode;
    };
    content: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    classNames?: {
        dialog?: {
            content?: string;
        };
    };
}

export const DialogDrawer: FC<Props> = props => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Drawer open={props.open} onOpenChange={props.onOpenChange} shouldScaleBackground>
                <DrawerTrigger asChild>{props.trigger}</DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{props.header.title}</DrawerTitle>
                        <DrawerDescription>{props.header.description}</DrawerDescription>
                    </DrawerHeader>
                    {props.content}
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            <DialogTrigger asChild>{props.trigger}</DialogTrigger>
            <DialogContent className={props.classNames?.dialog?.content}>
                <DialogHeader>
                    <DialogTitle>{props.header.title}</DialogTitle>
                    <DialogDescription>{props.header.description}</DialogDescription>
                </DialogHeader>
                {props.content}
            </DialogContent>
        </Dialog>
    );
};
