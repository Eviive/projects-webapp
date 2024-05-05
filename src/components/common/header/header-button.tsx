import { Button } from "components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import type { FC } from "react";
import type { HeaderItemProps } from "types/header";

type Props = HeaderItemProps & {
    handleClick: () => void;
    className?: string;
};

export const HeaderButton: FC<Props> = props => {
    if (props.type === "header") {
        return (
            <Button className={props.className} onClick={props.handleClick}>
                {props.icon}
                <span className="truncate">{props.title}</span>
            </Button>
        );
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button className={props.className} onClick={props.handleClick}>
                        {props.icon}
                        <span className="sr-only">{props.title}</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{props.title}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
