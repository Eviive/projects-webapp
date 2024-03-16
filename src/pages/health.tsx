import { useQuery } from "@tanstack/react-query";
import { HealthService } from "api/services/health";
import { Page } from "components/common/page";
import { HttpExchangesTable } from "components/health/http-exchanges-table";
import { HttpStatusCard } from "components/health/http-status-card";
import { Grid } from "layouts/grid";
import type { FC } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineExclamationCircle, AiOutlineQuestionCircle } from "react-icons/ai";

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

    const query = useQuery({
        queryKey: [ "httpExchanges" ],
        queryFn: HealthService.httpExchanges
    });

    return (
        <Page title="Health">
            <div className="w-full h-full px-[5%] py-16 flex flex-col gap-12">
                <Grid columnCount={4}>
                    {HTTP_STATUS.map(status => (
                        <HttpStatusCard
                            key={status.code}
                            {...status}
                            value={
                                query.isSuccess
                                    ? query.data.filter(httpExchange => httpExchange.response.status === status.code).length
                                    : 0
                            }
                            isLoading={query.isLoading}
                            isError={query.isError}
                        />
                    ))}
                </Grid>
                <HttpExchangesTable queryHttpExchanges={query} />
            </div>
        </Page>
    );
};
