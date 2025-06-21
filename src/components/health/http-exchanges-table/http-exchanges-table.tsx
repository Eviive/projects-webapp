import type { UseQueryResult } from "@tanstack/react-query";
import { DataTable } from "components/ui/data-table";
import type { FC } from "react";
import type { HttpExchange } from "types/health";
import { columns } from "./columns";

interface Props {
    queryHttpExchanges: UseQueryResult<HttpExchange[]>;
}

export const HttpExchangesTable: FC<Props> = ({ queryHttpExchanges: query }) => {
    return (
        <DataTable
            columns={columns}
            data={query.data ?? []}
            noRowsMessage="No HTTP exchanges found"
            isLoading={query.isLoading}
            isError={query.isError}
            errorMessage="Failed to load HTTP exchanges"
        />
    );
};
