import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Separator } from "components/ui/separator";
import type { FC, ReactNode } from "react";
import type { Status } from "types/health";

interface Props {
    title: string;
    icon: ReactNode;
    status: Status;
}

const STATUS_COLORS: Record<Status, string> = {
    UP: "hsl(121deg 34% 51%)",
    DOWN: "hsl(355deg, 60%, 52%)",
    OUT_OF_SERVICE: "hsl(21deg, 100%, 50%)",
    UNKNOWN: "hsl(0deg, 0%, 50%)"
};

export const StatusCard: FC<Props> = props => {
    return (
        <Card className="flex shrink grow basis-64 flex-col gap-1 rounded-lg font-bold">
            <CardHeader className="space-y-0 p-3">
                <CardTitle className="flex flex-row items-center text-lg">
                    <span
                        className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: STATUS_COLORS[props.status] }}
                    />
                    {props.title}
                </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-row items-center justify-between p-3 text-3xl">
                {props.icon}
                <p>{props.status}</p>
            </CardContent>
        </Card>
    );
};
