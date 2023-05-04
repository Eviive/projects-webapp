import { HealthService } from "api/services";
import { Loader } from "components/common";
import { HttpStatusCard, TracesTable } from "components/health";
import { useCustomQuery } from "hooks/useCustomQuery";
import { GridLayout } from "layouts";
import { FC } from "react";
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

    const query = useCustomQuery(["httpExchanges"], HealthService.httpExchanges);

    return (
        <>
            { query.isSuccess

                ? <div className={styles.healthWrapper}>
                    <div className={styles.healthContent}>
                        <GridLayout className={styles.statusCardsWrapper}>
                            {HTTP_STATUS.map((status, index) => {
                                const value = query.data.exchanges.filter(t => t.response.status === status.code).length;
                                return <HttpStatusCard key={index} {...status} value={value} />;
                            })}
                        </GridLayout>
                        <TracesTable httpTraces={query.data.exchanges} />
                    </div>
                </div>

                : <Loader />
            }
        </>
    );
};
