import { Modal } from "components/common";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import type { HttpExchange } from "types/health";
import { formatClassNames } from "utils/components";

import styles from "./http-exchange-details.module.scss";

type Props = {
    httpExchange: HttpExchange;
    handleClose: () => void;
};

export const HttpExchangeDetails: FC<Props> = ({ httpExchange, handleClose }) => {

    const [ content, setContent ] = useState<"request" | "response">("request");

    const parseObject = (obj: object): ReactNode => {
        return Object.entries(obj).map(([ key, val ]) => {
            if (Array.isArray(val) || !(val instanceof Object)) {
                return <span key={key}><strong>{key}:</strong> {Array.isArray(val) ? val.join(" ") : val}</span>;
            } else {
                return parseObject(val);
            }
        });
    };

    return (
        <Modal title="HTTP Exchange Details" handleClose={handleClose}>
            <div className={styles.detailsSwitch}>
                <button
                    className={formatClassNames(content === "request" && styles.active)}
                    onClick={() => setContent("request")}>
                    Request
                </button>
                <button
                    className={formatClassNames(content === "response" && styles.active)}
                    onClick={() => setContent("response")}>
                    Response
                </button>
            </div>
            <div className={styles.detailsContent}>
                {content === "request"

                    ? <>
                        <span><strong>Timestamp:</strong> {new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: "short" }).format(new Date(httpExchange.timestamp))}</span>
                        <span><strong>Time taken:</strong> {Math.trunc(parseFloat(httpExchange.timeTaken.substring(2, httpExchange.timeTaken.length - 1)) * 1000)} ms</span>
                        {!!httpExchange.principal && <span><strong>Principal:</strong> {httpExchange.principal.name}</span>}
                        {parseObject(httpExchange.request)}
                    </>

                    : parseObject(httpExchange.response)
                }
            </div>
        </Modal>
    );
};
