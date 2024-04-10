import { Button } from "components/ui/button";
import { Calendar, type CalendarProps } from "components/ui/calendar";
import { FormControl } from "components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { cn } from "libs/utils/style";
import type { FC } from "react";
import { LuCalendar } from "react-icons/lu";

type Props = {
    buttonText: string;
} & CalendarProps;

export const CalendarInput: FC<Props> = props => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant="outline"
                        className={cn(
                            "flex w-full pl-3 text-left font-normal",
                            !props.selected && "text-muted-foreground"
                        )}
                    >
                        {props.buttonText}
                        <LuCalendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar {...props} />
            </PopoverContent>
        </Popover>
    );
};
