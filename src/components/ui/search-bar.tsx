import { Input } from "components/ui/input";
import { debounce } from "lib/utils/debounce";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

type DebounceProps = {
    debounce: number;
    handleDebounce: (value: string) => void | Promise<void>;
};

type NoDebounceProps = {
    debounce?: never;
    handleDebounce?: never;
};

type Props = {
    value: string;
    handleChange: (value: string) => void | Promise<void>;
    isDisabled?: boolean;
} & (DebounceProps | NoDebounceProps);

export const SearchBar: FC<Props> = props => {

    const ref = useRef<DebounceProps["handleDebounce"]>();

    useEffect(() => {
        if (props.debounce) {
            ref.current = debounce(props.handleDebounce, props.debounce);
        }
    }, [ props.debounce, props.handleDebounce ]);

    return (
        <div className="relative grow">
            <HiMagnifyingGlass size={20} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
                className="pl-8"
                placeholder="Type to search..."
                value={props.value}
                onChange={e => {
                    props.handleChange(e.target.value);
                    ref.current?.(e.target.value);
                }}
                disabled={props.isDisabled}
            />
        </div>
    );
};
