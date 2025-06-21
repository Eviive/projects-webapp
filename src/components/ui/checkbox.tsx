"use client";

import { Indicator, Root } from "@radix-ui/react-checkbox";
import { cn } from "libs/utils/style";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { LuCheck } from "react-icons/lu";

const Checkbox = forwardRef<ElementRef<typeof Root>, ComponentPropsWithoutRef<typeof Root>>(
    ({ className, ...props }, ref) => (
        <Root
            ref={ref}
            className={cn(
                "peer border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-4 w-4 shrink-0 rounded-sm border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            <Indicator className={cn("flex items-center justify-center text-current")}>
                <LuCheck className="h-4 w-4" />
            </Indicator>
        </Root>
    )
);

Checkbox.displayName = Root.displayName;

export { Checkbox };
