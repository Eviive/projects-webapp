import { cn } from "libs/utils/style";
import type { HTMLAttributes } from "react";

const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    return <div className={cn("bg-muted animate-pulse rounded-md", className)} {...props} />;
};

export { Skeleton };
