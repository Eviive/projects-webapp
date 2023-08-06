import type { FC } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

import styles from "./search-bar.module.scss";

type Props = {
    handleChange: (value: string) => void | Promise<void>;
};

export const SearchBar: FC<Props> = props => {
    return (
        <div className={styles.wrapper}>
            <input
                className={styles.input}
                placeholder="Search"
                onChange={e => props.handleChange(e.target.value)}
            />
            <HiMagnifyingGlass size={25} />
        </div>
    );
};
