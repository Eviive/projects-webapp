import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "components/ui/dialog";
import { ScrollArea } from "components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import type { FC, ReactNode } from "react";
import type { HttpExchange } from "types/health";

const dateFormatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: "short" });

type Props = {
    httpExchange: HttpExchange;
    trigger: ReactNode;
};

export const HttpExchangeDetails: FC<Props> = ({ httpExchange, trigger }) => {

    const parseObject = (obj: object): ReactNode => {
        return Object
            .entries(obj)
            .map(([ key, val ]) => {
                if (typeof val === "object" && !Array.isArray(val)) {
                    return parseObject(val);
                }
                return (
                    <span key={key}>
                        <strong className="capitalize">{key}:</strong>
                        {" "}{Array.isArray(val) ? val.join(" ") : val}
                    </span>
                );
            });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>HTTP Exchange Details</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="request" className="flex flex-col gap-3">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="request">Request</TabsTrigger>
                        <TabsTrigger value="response">Response</TabsTrigger>
                    </TabsList>
                    <ScrollArea className="h-[400px]">
                        <TabsContent value="request" className="flex flex-col gap-2 [overflow-wrap:anywhere]">
                            <span>
                                <strong>Timestamp:</strong>
                                {" "}
                                {dateFormatter.format(new Date(httpExchange.timestamp))}
                            </span>
                            <span>
                                <strong>Time Taken:</strong>
                                {" "}
                                {Math.trunc(parseFloat(httpExchange.timeTaken.substring(2, httpExchange.timeTaken.length - 1)) * 1000)} ms
                            </span>
                            {!!httpExchange.principal && (
                                <span>
                                    <strong>Principal:</strong>
                                    {" "}{httpExchange.principal.name}
                                </span>
                            )}
                            {parseObject(httpExchange.request)}
                        </TabsContent>
                        <TabsContent value="response" className="flex flex-col gap-2 [overflow-wrap:anywhere]">
                            {parseObject(httpExchange.response)}
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
