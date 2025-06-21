"use client";

import { Content, Portal, Root, Trigger } from "@radix-ui/react-popover";
import { cn } from "libs/utils/style";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";

const Popover = Root;

const PopoverTrigger = Trigger;

const PopoverContent = forwardRef<
    ElementRef<typeof Content>,
    ComponentPropsWithoutRef<typeof Content> & { portal?: boolean }
>(({ className, align = "center", sideOffset = 4, portal = true, ...props }, ref) => {
    const content = (
        <Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={cn(
                "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md outline-none",
                className
            )}
            {...props}
        />
    );

    if (!portal) return content;

    return <Portal>{content}</Portal>;
});

PopoverContent.displayName = Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
