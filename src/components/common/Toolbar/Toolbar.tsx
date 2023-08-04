import { Button } from "components/common";
import { FC, PropsWithChildren } from "react";

import styles from "./toolbar.module.scss";

type Tool = {
    name: string;
    className?: string;
    handleClick: () => (void | Promise<void>);
    loading?: boolean;
};

type Props = {
    tools: PropsWithChildren<Tool>[];
};

export const Toolbar: FC<Props> = props => {

    const buttons = props.tools.map(tool => (
        <Button
            key={tool.name}
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
