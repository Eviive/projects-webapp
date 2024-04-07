import { HttpStatusChip } from "components/health/http-status-chip";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { useCountUp } from "hooks/use-count-up";
import type { FC, ReactNode } from "react";
import { useEffect } from "react";

type Props = {
    name: string;
    code: number;
    icon: ReactNode;
    value: number;
    isLoading?: boolean;
    isError?: boolean;
};

export const HttpStatusCard: FC<Props> = props => {
    const { count, setStart } = useCountUp(props.value, 1000);

    useEffect(() => {
        if (!props.isLoading && !props.isError) {
            setStart(true);
        }
    }, [props.isLoading, props.isError, setStart]);

    let value: number | string;
    if (props.isError) {
        value = "N/A";
    } else if (props.isLoading) {
        value = 0;
    } else {
        value = count;
    }

    return (
        <li>
            <Card className="flex shrink grow basis-64 flex-col gap-1 rounded-lg font-bold">
                <CardHeader className="space-y-0 p-3">
                    <CardTitle className="flex flex-row items-center gap-2 text-lg">
                        {props.name}
                        <HttpStatusChip code={props.code} />
                    </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="flex flex-row items-center justify-between p-3 text-3xl">
                    {props.icon}
                    {value}
                </CardContent>
            </Card>
        </li>
    );
};
