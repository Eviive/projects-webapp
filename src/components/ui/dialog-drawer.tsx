import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "components/ui/dialog";
import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger} from "components/ui/drawer";
import {useMediaQuery} from "hooks/use-media-query";
import type {FC, ReactNode} from "react";

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
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
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
    }

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
};
