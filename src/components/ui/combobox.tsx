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

type Props<V> = {
    options: V[];
    value?: V;
    onChange: (value: V) => void;
    renderItem: (item: V) => ReactNode;
    getKey: (item: V) => Key;
    getValue: (item: V) => string;
    placeholder: string;
    noOptionsText: string;
} & LoadingProps &
    ErrorProps;

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
                {props.options.map(item => (
                    <CommandItem
                        key={props.getKey(item)}
                        value={props.getValue(item)}
                        onSelect={() => props.onChange(item)}
                    >
                        <LuCheck
                            className={cn(
                                "mr-2 h-4 w-4",
                                props.value !== undefined &&
                                    props.getKey(props.value) === props.getKey(item)
                                    ? "opacity-100"
                                    : "opacity-0"
                            )}
                        />
                        {props.renderItem(item)}
                    </CommandItem>
                ))}
            </CommandList>
        </Command>
    );
};
