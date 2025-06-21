"use client";

import { Content, List, Root, Trigger } from "@radix-ui/react-tabs";
import { cn } from "libs/utils/style";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";

const Tabs = Root;

const TabsList = forwardRef<ElementRef<typeof List>, ComponentPropsWithoutRef<typeof List>>(
    ({ className, ...props }, ref) => (
        <List
            ref={ref}
            className={cn(
                "bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1",
                className
            )}
            {...props}
        />
    )
);

TabsList.displayName = List.displayName;

const TabsTrigger = forwardRef<
    ElementRef<typeof Trigger>,
    ComponentPropsWithoutRef<typeof Trigger>
>(({ className, ...props }, ref) => (
    <Trigger
        ref={ref}
        className={cn(
            "ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm",
            className
        )}
        {...props}
    />
));

TabsTrigger.displayName = Trigger.displayName;

const TabsContent = forwardRef<
    ElementRef<typeof Content>,
    ComponentPropsWithoutRef<typeof Content>
>(({ className, ...props }, ref) => (
    <Content
        ref={ref}
        className={cn(
            "ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
            className
        )}
        {...props}
    />
));

TabsContent.displayName = Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
