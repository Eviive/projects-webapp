import { Button } from "components/ui/button";
import { ComboboxEmpty } from "components/ui/combobox-empty";
import { Command, CommandInput, CommandItem, CommandList } from "components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { conjunctionListFormatter } from "libs/intl-formatter";
import { cn } from "libs/utils/style";
import type { Key, ReactNode } from "react";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";
import type { PropsWithStatus } from "types/utils/props";

type Props<V> = PropsWithStatus<CommonProps<V> & (SingleProps<V> | MultipleProps<V>)>;

interface CommonProps<V> {
    options: V[];
    onChange: (value: V, isSelected: boolean) => void;
    renderItem: (item: V) => ReactNode;
    getKey: (item: V) => Key;
    getValue: (item: V) => string;
    placeholder: string;
    searchPlaceholder: string;
}

interface SingleProps<V> {
    selection: "single";
    value?: V;
}

interface MultipleProps<V> {
    selection: "multiple";
    value: V[];
}

export const Combobox = <V,>(props: Props<V>) => {
    const getButtonLabel = () => {
        if (props.selection === "multiple" && props.value.length > 0) {
            return conjunctionListFormatter.format(props.value.map(item => props.getValue(item)));
        }

        if (props.selection === "single" && props.value !== undefined) {
            return props.getValue(props.value);
        }

        return props.placeholder;
    };

    return (
        <Popover modal>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "flex w-full justify-between font-normal",
                        (props.selection === "multiple"
                            ? props.value.length <= 0
                            : props.value === undefined) && "text-muted-foreground"
                    )}
                >
                    <span className="truncate">{getButtonLabel()}</span>
                    <LuChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[200px] p-0">
                <Command loop>
                    <CommandInput placeholder={props.searchPlaceholder} className="h-9" />
                    <CommandList>
                        <ComboboxEmpty
                            empty={props.empty}
                            loading={props.loading}
                            error={props.error}
                        />
                        {props.options.map(item => {
                            const isSelected =
                                props.selection === "multiple"
                                    ? props.value.some(
                                          value => props.getKey(value) === props.getKey(item)
                                      )
                                    : props.value !== undefined &&
                                      props.getKey(props.value) === props.getKey(item);

                            let checkClassName: string | null = null;
                            if (props.selection === "multiple") {
                                checkClassName = isSelected ? "opacity-100" : "opacity-0";
                            }

                            return (
                                <CommandItem
                                    key={props.getKey(item)}
                                    value={props.getValue(item)}
                                    onSelect={() => {
                                        props.onChange(item, !isSelected);
                                    }}
                                    className="gap-3"
                                >
                                    <LuCheck className={cn("size-4", checkClassName)} />
                                    {props.renderItem(item)}
                                </CommandItem>
                            );
                        })}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
