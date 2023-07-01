import { FC, ReactNode } from "react";

type Props = {
    href: string,
    className?: string,
    children?: ReactNode
};

export const Anchor: FC<Props> = props => {
    return (
        <a href={props.href} className={props.className} target="_blank" rel="noreferrer">
            {props.children}
        </a>
    );
};
