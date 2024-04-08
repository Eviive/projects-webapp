import { Button } from "components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList
} from "components/ui/command";
import { FormControl } from "components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { cn } from "lib/utils/style";
import type { Key, ReactNode } from "react";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";

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
    noOptionsText: string;
} & LoadingProps &
    ErrorProps;

type SingleProps<V> = {
    selection?: "single";
    value?: V;
};

type MultipleProps<V> = {
    selection: "multiple";
    value: V[];
};

type LoadingProps =
    | {
          loading?: false;
      }
    | {
          loading: true;
          loadingText: string;
      };

type ErrorProps =
    | {
          error?: false;
      }
    | {
          error: true;
          errorText: string;
      };

export const Combobox = <V,>(props: Props<V>) => {
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
                <Command>
                    <CommandInput placeholder={props.searchPlaceholder} />
                    <CommandList className="max-h-[204px]">
                        <CommandEmpty>
                            {props.options.length <= 0 && props.noOptionsText}
                            {props.loading && props.loadingText}
                            {props.error && props.errorText}
                        </CommandEmpty>
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
                                >
                                    <LuCheck
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            isSelected ? "opacity-100" : "opacity-0"
                                        )}
                                    />
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
