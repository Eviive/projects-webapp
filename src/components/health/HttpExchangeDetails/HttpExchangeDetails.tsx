import { Modal, ModalBody, ModalContent, ModalHeader, Tab, Tabs, useDisclosure } from "@nextui-org/react";
import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import type { HttpExchange } from "types/health";

const dateFormatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: "short" });

type TabType = {
    name: string;
    content: ReactNode;
};

type Props = {
    httpExchange: HttpExchange | null;
    handleClose: () => void;
};

export const HttpExchangeDetails: FC<Props> = ({ httpExchange, handleClose }) => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        if (httpExchange !== null) {
            onOpen();
        }
    }, [ httpExchange, onOpen ]);

    const parseObject = (obj: object): ReactNode => {
        return Object
            .entries(obj)
            .map(([ key, val ]) => {
                if (val instanceof Object && !Array.isArray(val)) {
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

    const tabs: TabType[] = [
        {
            name: "Request",
            content: httpExchange && (
                <>
                    <span>
                        <strong>Timestamp:</strong>
                        {" "}{dateFormatter.format(new Date(httpExchange.timestamp))}
                    </span>
                    <span>
                        <strong>Time Taken:</strong>
                        {" "}{Math.trunc(parseFloat(httpExchange.timeTaken.substring(2, httpExchange.timeTaken.length - 1)) * 1000)} ms
                    </span>
                    {!!httpExchange.principal && (
                        <span>
                            <strong>Principal:</strong>
                            {" "}{httpExchange.principal.name}
                        </span>
                    )}
                    {parseObject(httpExchange.request)}
                </>
            )
        },
        {
            name: "Response",
            content: httpExchange && parseObject(httpExchange.response)
        }
    ];

    return (
        <Modal
            classNames={{
                body: "h-[500px] flex-none",
                wrapper: "items-center"
            }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={handleClose}
        >
            <ModalContent>
                <ModalHeader>HTTP Exchange Details</ModalHeader>
                <ModalBody>
                    <Tabs
                        classNames={{
                            tabList: "w-full",
                            panel: "flex flex-col gap-2 overflow-y-auto [overflow-wrap:anywhere]"
                        }}
                        items={tabs}
                    >
                        {tab => (
                            <Tab key={tab.name} title={tab.name}>
                                {tab.content}
                            </Tab>
                        )}
                    </Tabs>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
