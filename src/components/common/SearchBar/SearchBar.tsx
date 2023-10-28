import { Input } from "components/common";
import type { FC } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

type Props = {
    handleChange: (value: string) => void | Promise<void>;
};

export const SearchBar: FC<Props> = props => {
    return (
        <Input
            className="self-center max-w-sm"
            startContent={<HiMagnifyingGlass size={25} />}
            placeholder="Type to search..."
            onChange={e => props.handleChange(e.target.value)}
        />
    );
};
