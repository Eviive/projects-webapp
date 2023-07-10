import { Button } from "components/common";
import { FC, MouseEventHandler, PropsWithChildren } from "react";

import styles from "./toolbar.module.scss";

type Tool = {
    className?: string;
    handleClick: MouseEventHandler<HTMLButtonElement>;
    loading?: boolean;
};

type Props = {
    tools: PropsWithChildren<Tool>[];
};

export const Toolbar: FC<Props> = props => {

    const buttons = props.tools.map((tool, index) => (
        <Button
            key={index}
            className={tool.className}
            loading={tool.loading}
            handleClick={tool.handleClick}
            round={true}
        >
            {tool.children}
        </Button>
    ));

    return (
        <div className={styles.toolbar}>
            {buttons}
        </div>
    );
};
