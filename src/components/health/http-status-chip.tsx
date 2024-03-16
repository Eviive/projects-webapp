import { Badge } from "components/ui/badge";
import type { FC } from "react";

type Props = {
    code: number;
};

export const HttpStatusChip: FC<Props> = props => {

    const colorCode = [ 401, 403 ].includes(props.code)
        ? props.code
        : Math.floor(props.code / 100) * 100;

    return (
        <Badge
            className={`status-${colorCode}`}
            variant="outline"
        >
            {props.code}
        </Badge>
    );
};
