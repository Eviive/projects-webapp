import { HttpStatusChip } from "components/health";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Separator } from "components/ui/separator";
import type { FC, ReactNode } from "react";

type Props = {
    name: string;
    code: number;
    icon: ReactNode;
    value: number | null;
    isError?: boolean;
};

export const HttpStatusCard: FC<Props> = props => {
    return (
        <li>
            <Card className="basis-64 grow shrink flex flex-col gap-1 font-bold rounded-lg">
                <CardHeader className="space-y-0 p-3">
                    <CardTitle className="text-lg flex flex-row items-center gap-2">
                        {props.name}
                        <HttpStatusChip code={props.code} />
                    </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="p-3 flex flex-row justify-between items-center text-3xl">
                    {props.icon}
                    {props.isError
                        ? "N/A"
                        : props.value ?? 0
                    }
                </CardContent>
            </Card>
        </li>
    );
};
