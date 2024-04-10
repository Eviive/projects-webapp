import type { HeaderType } from "components/common/header/header";
import { Button } from "components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import type { FC, ReactNode } from "react";

type Props = {
    type: HeaderType;
    title: string;
    handleClick: () => void;
    icon: ReactNode;
    className?: string;
};

export const HeaderButton: FC<Props> = props => {
    if (props.type === "header") {
        return (
            <Button className={props.className} onClick={props.handleClick}>
                {props.icon}
                {props.title}
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
