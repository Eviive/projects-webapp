import { Chip } from "@nextui-org/react";
import type { FC } from "react";

type Props = {
    code: number;
};

export const HttpStatusChip: FC<Props> = props => {
    return (
        <Chip
            className={`status-${props.code}`}
            variant="flat"
            size="sm"
        >
            {props.code}
        </Chip>
    );
};
