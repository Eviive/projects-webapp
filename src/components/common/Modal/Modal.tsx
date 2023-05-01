import { ModalConfig, useCloseEvents } from "hooks/useCloseEvents";
import { FC, ReactNode } from "react";
import { CgClose } from "react-icons/cg";

import styles from "./modal.module.scss";

type Props = {
    title: string;
    handleClose: () => void;
    children: ReactNode;
    config?: ModalConfig;
};

export const Modal: FC<Props> = props => {

    const wrapperRef = useCloseEvents<HTMLDivElement>(props.handleClose, props.config);

    return (
        <div className={styles.modalWrapper + " no-scroll"} ref={wrapperRef}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h1>{props.title}</h1>
                    <button onClick={props.handleClose}>
                        <CgClose size={25} />
                    </button>
                </div>
                <div className={styles.modalBody}>
                    {props.children}
                </div>
            </div>
        </div>
    );
};
