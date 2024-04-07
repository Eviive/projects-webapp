import { Badge } from "components/ui/badge";
import type { FC } from "react";

type Props = {
    code: number;
};

const statusColors: Record<number, string> = {
    100: "gray-600",
    200: "green-600",
    300: "blue-600",
    400: "yellow-500",
    401: "yellow-600",
    403: "orange-600",
    500: "danger"
};

export const HttpStatusChip: FC<Props> = props => {
    const colorCode = [401, 403].includes(props.code)
        ? props.code
        : Math.floor(props.code / 100) * 100;

    const color = statusColors[colorCode];

    return (
        <Badge className={`text-${color} bg-${color}/10`} variant="outline">
            {props.code}
        </Badge>
    );
};
