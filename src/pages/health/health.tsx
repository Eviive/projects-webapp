import { useQuery } from "@tanstack/react-query";
import { Page } from "components/common/page";
import { HttpExchangesTable } from "components/health/http-exchanges-table";
import { HttpStatusCard } from "components/health/http-status-card";
import { Grid } from "layouts/grid";
import type { healthLoader } from "pages/health/health.loader";
import { httpExchangesQueryOptions } from "pages/health/health.loader";
import type { FC } from "react";
import {
    AiOutlineCheckCircle,
    AiOutlineCloseCircle,
    AiOutlineExclamationCircle,
    AiOutlineQuestionCircle
} from "react-icons/ai";
import { useLoaderData } from "react-router-dom";
import type { QueryLoaderFunctionData } from "types/loader";

const HTTP_STATUS = [
    {
        name: "OK",
        code: 200,
        icon: <AiOutlineCheckCircle size={40} />
    },
    {
        name: "Bad Request",
        code: 400,
        icon: <AiOutlineExclamationCircle size={40} />
    },
    {
        name: "Unauthorized",
        code: 401,
        icon: <AiOutlineCloseCircle size={40} />
    },
    {
        name: "Internal Server Error",
        code: 500,
        icon: <AiOutlineQuestionCircle size={40} />
    }
];

export const Health: FC = () => {
    const initialHttpExchanges = useLoaderData() as QueryLoaderFunctionData<typeof healthLoader>;

    const httpExchangesQuery = useQuery({
        ...httpExchangesQueryOptions,
        initialData: initialHttpExchanges ?? undefined
    });

    return (
        <Page title="Health">
            <div className="flex h-full w-full flex-col gap-12 px-[5%] py-12">
                <Grid columnCount={4}>
                    {HTTP_STATUS.map(status => (
                        <HttpStatusCard
                            key={status.code}
                            {...status}
                            value={
                                httpExchangesQuery.isSuccess
                                    ? httpExchangesQuery.data.filter(
                                          httpExchange =>
                                              httpExchange.response.status === status.code
                                      ).length
                                    : 0
                            }
                            isLoading={httpExchangesQuery.isLoading}
                            isError={httpExchangesQuery.isError}
                        />
                    ))}
                </Grid>
                <HttpExchangesTable queryHttpExchanges={httpExchangesQuery} />
            </div>
        </Page>
    );
};
