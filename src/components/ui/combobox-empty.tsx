import { useCommandState } from "cmdk";
import { CommandEmpty } from "components/ui/command";
import type { FC } from "react";

type Props = {
    emptyOptions: false | string;
    loading: false | string;
    error: false | string;
};

export const ComboboxEmpty: FC<Props> = props => {
    const search = useCommandState(state => state.search);

    return (
        <CommandEmpty>
            {props.emptyOptions}
            {props.loading}
            {props.error}
            {search && props.emptyOptions === false && `No results found for "${search}".`}
        </CommandEmpty>
    );
};
