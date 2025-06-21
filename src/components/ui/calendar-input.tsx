import { Button } from "components/ui/button";
import { Calendar, CalendarProps } from "components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { format } from "date-fns";
import { cn } from "libs/utils/style";
import type { FC } from "react";
import { LuCalendar } from "react-icons/lu";

type Props = CalendarProps & {
    mode: "single";
};

export const CalendarInput: FC<Props> = props => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "flex w-full pl-3 text-left font-normal",
                        props.selected !== undefined && "text-muted-foreground"
                    )}
                >
                    {props.selected !== undefined ? format(props.selected, "PPP") : "Pick a date"}
                    <LuCalendar className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar {...props} />
            </PopoverContent>
        </Popover>
    );
};
