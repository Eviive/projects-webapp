import { useCloseEvents } from "hooks/useCloseEvents";
import { FC } from "react";
import { createPortal } from "react-dom";

import styles from "./popup.module.scss";

export type Props = {
    title?: string;
    message?: string;
    show: boolean;
    handleClose: () => void;
};

export const Popup: FC<Props> = props => {

    const wrapperRef = useCloseEvents<HTMLDivElement>(props.handleClose);

    return (
        <>
            { props.show && createPortal(
                <div className={styles.popupWrapper + " no-scroll"} ref={wrapperRef}>
                    <div className={styles.popup}>
                        <div className={styles.popupContent}>
                            <h1>{props.title}</h1>
                            {props.message && <p>{props.message}</p>}
                        </div>
                        <button className={styles.popupButton} onClick={props.handleClose} autoFocus>Close</button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
