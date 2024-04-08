import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList
} from "components/ui/command";
import { cn } from "lib/utils/style";
import type { Key, ReactNode } from "react";
import { LuCheck } from "react-icons/lu";

type Props<V> = CommonProps<V> & (SingleProps<V> | MultipleProps<V>);

type CommonProps<V> = {
    options: V[];
    onChange: (value: V, isSelected: boolean) => void;
    renderItem: (item: V) => ReactNode;
    getKey: (item: V) => Key;
    getValue: (item: V) => string;
    placeholder: string;
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
    return (
        <Command>
            <CommandInput placeholder={props.placeholder} />
            <CommandList className="max-h-[204px]">
                <CommandEmpty>
                    {props.options.length <= 0 && props.noOptionsText}
                    {props.loading && props.loadingText}
                    {props.error && props.errorText}
                </CommandEmpty>
                {props.options.map(item => {
                    const isSelected =
                        props.selection === "multiple"
                            ? props.value.some(value => props.getKey(value) === props.getKey(item))
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
    );
};
