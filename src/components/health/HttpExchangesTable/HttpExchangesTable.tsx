import type { UseQueryResult } from "@tanstack/react-query";
import { HttpExchangeDetails } from "components/health";
import { DataTable } from "components/ui/data-table";
import { type FC, useMemo, useState } from "react";
import type { HttpExchange } from "types/health";
import { getColumns } from "./columns";

type Props = {
    queryHttpExchanges: UseQueryResult<HttpExchange[], Error>;
};

export const HttpExchangesTable: FC<Props> = props => {

    const [ httpExchangeDetails, setHttpExchangeDetails ] = useState<HttpExchange | null>(null);

    const columns = useMemo(() => getColumns(setHttpExchangeDetails), []);

    return (
        <>
            <HttpExchangeDetails
                httpExchange={httpExchangeDetails}
                handleClose={() => setHttpExchangeDetails(null)}
            />
            {props.queryHttpExchanges.isSuccess && (
                <DataTable columns={columns} data={props.queryHttpExchanges.data} />
            )}
        </>
    );
};
