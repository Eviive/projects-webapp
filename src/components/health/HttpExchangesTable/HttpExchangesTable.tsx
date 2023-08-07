import { HttpExchangeDetails } from "components/health";
import type { FC } from "react";
import { useState } from "react";
import { CgDetailsMore } from "react-icons/cg";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import type { HttpExchange } from "types/health";
import { formatClassNames } from "utils/components";

import styles from "./http-exchanges-table.module.scss";

type Props = {
    httpExchanges: HttpExchange[];
};

export const HttpExchangesTable: FC<Props> = ({ httpExchanges }) => {

    const [ page, setPage ] = useState(0);

    const pageButtons = () => {
        const buttons = [];
        for (let i = 0; i < httpExchanges.length / 10; i++) {
            buttons.push(
                <button
                    key={i}
                    className={formatClassNames(page === i && styles.active)}
                    onClick={() => setPage(i)}
                >
                    {i + 1}
                </button>
            );
        }
        return buttons;
    };

    const [ httpExchangeDetails, setHttpExchangeDetails ] = useState<HttpExchange | null>(null);

    return (
        <>
            {!!httpExchangeDetails && <HttpExchangeDetails httpExchange={httpExchangeDetails} handleClose={() => setHttpExchangeDetails(null)} />}
            <div className={styles.httpExchangesContainer}>
                <div className={styles.tableResponsive}>
                    <table className={styles.httpExchangesTable}>
                        <thead className={styles.tableHead}>
                            <tr>
                                <th>Timestamp</th>
                                <th>Method</th>
                                <th>Time&nbsp;taken (ms)</th>
                                <th>Status</th>
                                <th>Path</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tableBody}>
                            {httpExchanges.slice(page * 10, (page + 1) * 10).map(httpExchange => {
                                const bgColor = `var(--status-${[ 401, 403 ].includes(httpExchange.response.status) ? httpExchange.response.status : Math.floor(httpExchange.response.status / 100) * 100})`;
                                return (
                                    <tr key={httpExchange.uuid}>
                                        <td>
                                            {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(httpExchange.timestamp))}
                                        </td>
                                        <td>
                                            {httpExchange.request.method}
                                        </td>
                                        <td>
                                            {Math.trunc(parseFloat(httpExchange.timeTaken.substring(2, httpExchange.timeTaken.length - 1)) * 1000)}
                                        </td>
                                        <td>
                                            <span className={styles.statusCell} style={{ backgroundColor: bgColor }}>
                                                {httpExchange.response.status}
                                            </span>
                                        </td>
                                        <td>
                                            {new URL(httpExchange.request.uri).pathname}
                                        </td>
                                        <td className={styles.detailsCell}>
                                            <button onClick={() => setHttpExchangeDetails(httpExchange)}>
                                                <CgDetailsMore size={30} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className={styles.pagination}>
                    <button onClick={() => setPage(page - 1)} disabled={page === 0}>
                        <MdNavigateBefore size={25} />
                    </button>
                    {pageButtons()}
                    <span>{`${httpExchanges.length > 0 ? page + 1 : 0} / ${Math.ceil(httpExchanges.length / 10)}`}</span>
                    <button onClick={() => setPage(page + 1)} disabled={page >= (httpExchanges.length / 10) - 1}>
                        <MdNavigateNext size={25} />
                    </button>
                </div>
            </div>
        </>
    );
};
