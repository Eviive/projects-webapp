import { Input } from "@nextui-org/react";
import type { FC } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

type Props = {
    value: string;
    handleChange: (value: string) => void | Promise<void>;
};

export const SearchBar: FC<Props> = props => {
    return (
        <Input
            classNames={{
                base: "self-center max-w-sm"
            }}
            size="sm"
            placeholder="Type to search..."
            startContent={<HiMagnifyingGlass size={25} />}
            value={props.value}
            onChange={e => props.handleChange(e.target.value)}
        />
    );
};
