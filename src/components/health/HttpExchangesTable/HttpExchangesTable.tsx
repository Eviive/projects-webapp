import { Button, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { HttpExchangeDetails, HttpStatusChip } from "components/health";
import type { FC, Key, ReactNode } from "react";
import { useMemo, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import type { HttpExchange } from "types/health";

const dateFormatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

type Props = {
    httpExchanges: HttpExchange[];
};

export const HttpExchangesTable: FC<Props> = props => {

    const [ httpExchangeDetails, setHttpExchangeDetails ] = useState<HttpExchange | null>(null);

    const [ page, setPage ] = useState(1);

    const rowsPerPage = 10;
    const pages = Math.ceil(props.httpExchanges.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return props.httpExchanges.slice(start, end);
    }, [ page, props.httpExchanges ]);

    const getCell = (httpExchange: HttpExchange, columnKey: Key): ReactNode | null => {
        switch (columnKey) {
            case "date":
                return (
                    <span className="whitespace-nowrap">
                        {dateFormatter.format(new Date(httpExchange.timestamp))}
                    </span>
                );

            case "method":
                return httpExchange.request.method;

            case "timeTaken":
                return Math.trunc(parseFloat(httpExchange.timeTaken.substring(2, httpExchange.timeTaken.length - 1)) * 1000);

            case "status": {
                const statusCode = [ 401, 403 ].includes(httpExchange.response.status)
                    ? httpExchange.response.status
                    : Math.floor(httpExchange.response.status / 100) * 100;
                return (
                    <HttpStatusChip code={statusCode} />
                );
            }

            case "path":
                return new URL(httpExchange.request.uri).pathname;

            case "details":
                return (
                    <div className="flex justify-end items-center">
                        <Tooltip content="View details">
                            <Button
                                className="text-foreground-500"
                                variant="light"
                                size="sm"
                                isIconOnly
                                onPress={() => setHttpExchangeDetails(httpExchange)}
                            >
                                <AiFillEye size={20} />
                            </Button>
                        </Tooltip>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            {!!httpExchangeDetails && (
                <HttpExchangeDetails
                    httpExchange={httpExchangeDetails}
                    handleClose={() => setHttpExchangeDetails(null)}
                />
            )}

            <Table
                aria-label="Http Exchanges"
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            page={page}
                            onChange={setPage}
                            total={pages}
                            isCompact
                            showControls
                            showShadow
                        />
                    </div>
                }
            >
                <TableHeader>
                    <TableColumn key="date">Date</TableColumn>
                    <TableColumn key="method">Method</TableColumn>
                    <TableColumn key="timeTaken">Time&nbsp;taken (ms)</TableColumn>
                    <TableColumn key="status">Status</TableColumn>
                    <TableColumn key="path">Path</TableColumn>
                    <TableColumn key="details">Details</TableColumn>
                </TableHeader>
                <TableBody items={items}>
                    {item => (
                        <TableRow key={item.uuid}>
                            {(columnKey) => (
                                <TableCell key={columnKey}>
                                    {getCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
};
