import { useQuery } from "@tanstack/react-query";
import { HealthService } from "api/services";
import { Loader, Page } from "components/common";
import { HttpExchangesTable, HttpStatusCard } from "components/health";
import { GridLayout } from "layouts";
import type { FC } from "react";
import { AiFillBug, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineExclamationCircle } from "react-icons/ai";

import styles from "./health.module.scss";

const HTTP_STATUS = [
    {
        name: "OK",
        code: 200,
        icon: <AiOutlineCheckCircle size={25} />
    },
    {
        name: "Bad Request",
        code: 400,
        icon: <AiOutlineExclamationCircle size={25} />
    },
    {
        name: "Unauthorized",
        code: 401,
        icon: <AiOutlineCloseCircle size={25} />
    },
    {
        name: "Internal Server Error",
        code: 500,
        icon: <AiFillBug size={25} />
    }
];

export const Health: FC = () => {

    const query = useQuery([ "httpExchanges" ], HealthService.httpExchanges);

    return (
        <Page title="Health">
            { query.isSuccess

                ? <div className={styles.healthWrapper}>
                    <div className={styles.healthContent}>
                        <GridLayout className={styles.statusCardsWrapper}>
                            {HTTP_STATUS.map(status => {
                                const value = query.data.filter(httpExchange => httpExchange.response.status === status.code).length;
                                return <HttpStatusCard key={status.code} {...status} value={value} />;
                            })}
                        </GridLayout>
                        <HttpExchangesTable httpExchanges={query.data} />
                    </div>
                </div>

                : <Loader />
            }
        </Page>
    );
};
