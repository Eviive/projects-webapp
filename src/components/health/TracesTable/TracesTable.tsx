import { TraceDetails } from "components/health";
import { FC, useState } from "react";
import { CgDetailsMore } from "react-icons/cg";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { HttpExchange } from "types/health";
import { formatClassNames } from "utils/components";

import styles from "./traces-table.module.scss";

type Props = {
    httpTraces: HttpExchange[];
};

export const TracesTable: FC<Props> = ({ httpTraces }) => {

    const [ page, setPage ] = useState(0);

    const pageButtons = () => {
        const buttons = [];
        for (let i = 0; i < httpTraces.length / 10; i++) {
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

    const [ traceDetails, setTraceDetails ] = useState<HttpExchange | null>(null);

    return (
        <>
            {!!traceDetails && <TraceDetails trace={traceDetails} handleClose={() => setTraceDetails(null)} />}
            <div className={styles.tracesContainer}>
                <div className={styles.tableResponsive}>
                    <table className={styles.tracesTable}>
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
                            {httpTraces.slice(page * 10, (page + 1) * 10).map((trace, index) => {
                                const bgColor = `var(--status-${[ 401, 403 ].includes(trace.response.status) ? trace.response.status : Math.floor(trace.response.status / 100) * 100})`;
                                return (
                                    <tr key={index}>
                                        <td>
                                            {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(trace.timestamp))}
                                        </td>
                                        <td>
                                            {trace.request.method}
                                        </td>
                                        <td>
                                            {Math.trunc(parseFloat(trace.timeTaken.substring(2, trace.timeTaken.length - 1)) * 1000)}
                                        </td>
                                        <td>
                                            <span className={styles.statusCell} style={{ backgroundColor: bgColor }}>
                                                {trace.response.status}
                                            </span>
                                        </td>
                                        <td>
                                            {new URL(trace.request.uri).pathname}
                                        </td>
                                        <td className={styles.detailsCell}>
                                            <button onClick={() => setTraceDetails(trace)}>
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
                        <GrFormPrevious size={25} color="inherit" />
                    </button>
                    {pageButtons()}
                    <span>{`${httpTraces.length > 0 ? page + 1 : 0} / ${Math.ceil(httpTraces.length / 10)}`}</span>
                    <button onClick={() => setPage(page + 1)} disabled={page >= (httpTraces.length / 10) - 1}>
                        <GrFormNext size={25} color="inherit" />
                    </button>
                </div>
            </div>
        </>
    );
};
