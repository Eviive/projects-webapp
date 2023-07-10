import { FC, PropsWithChildren } from "react";

type Props = {
    href: string;
    className?: string;
};

export const Anchor: FC<PropsWithChildren<Props>> = props => {
    return (
        <a href={props.href} className={props.className} target="_blank" rel="noreferrer">
            {props.children}
        </a>
    );
};
