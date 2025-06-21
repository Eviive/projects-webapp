import { Input } from "components/ui/input";
import { debounce } from "libs/utils/debounce";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

interface Props {
    value: string;
    handleChange: (value: string) => void;
    debounce?: number;
    handleDebounce: (value: string) => void;
    isDisabled?: boolean;
}

export const SearchBar: FC<Props> = props => {
    const ref = useRef<Props["handleDebounce"]>();

    useEffect(() => {
        ref.current = debounce(props.handleDebounce, props.debounce ?? 300);
    }, [props.debounce, props.handleDebounce]);

    return (
        <div className="relative grow">
            <HiMagnifyingGlass
                size={20}
                className="text-muted-foreground absolute top-1/2 left-2 -translate-y-1/2"
            />
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
