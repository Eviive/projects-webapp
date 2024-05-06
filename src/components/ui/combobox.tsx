import { Button } from "components/ui/button";
import { ComboboxEmpty } from "components/ui/combobox-empty";
import { Command, CommandInput, CommandItem, CommandList } from "components/ui/command";
import { FormControl } from "components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { cn } from "libs/utils/style";
import type { Key, ReactNode } from "react";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";
import type { PropsWithStatus } from "types/utils/props";

const listFormatter = new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" });

type Props<V> = CommonProps<V> & (SingleProps<V> | MultipleProps<V>);

type CommonProps<V> = {
    options: V[];
    onChange: (value: V, isSelected: boolean) => void;
    renderItem: (item: V) => ReactNode;
    getKey: (item: V) => Key;
    getValue: (item: V) => string;
    placeholder: string;
    searchPlaceholder: string;
};

type SingleProps<V> = {
    selection: "single";
    value?: V;
};

type MultipleProps<V> = {
    selection: "multiple";
    value: V[];
};

export const Combobox = <V,>(props: PropsWithStatus<Props<V>>) => {
    const getButtonLabel = () => {
        if (props.selection === "multiple" && props.value.length > 0) {
            return listFormatter.format(props.value.map(item => props.getValue(item)));
        }

        if (props.selection === "single" && props.value !== undefined) {
            return props.getValue(props.value);
        }

        return props.placeholder;
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
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
                        <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[200px] p-0" portal={false}>
                <Command loop>
                    <CommandInput placeholder={props.searchPlaceholder} />
                    <CommandList className="max-h-[204px]">
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

                            return (
                                <CommandItem
                                    key={props.getKey(item)}
                                    value={props.getValue(item)}
                                    onSelect={() => props.onChange(item, !isSelected)}
                                    className="gap-3"
                                >
                                    {props.selection === "single" && (
                                        <LuCheck
                                            className={cn(
                                                "h-4 w-4",
                                                isSelected ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    )}
                                    {props.selection === "multiple" && (
                                        <div
                                            className={cn(
                                                "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <LuCheck className="h-4 w-4" />
                                        </div>
                                    )}
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
