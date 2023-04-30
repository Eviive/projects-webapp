import { FC } from "react";
import { NavLink } from "react-router-dom";
import { Route } from "types/app";

import styles from "./link.module.scss";

type Props = {
    route: Route;
    className?: string;
};

export const Link: FC<Props> = ({ route, className }) => {
    return (
        <NavLink
            to={route.path}
            className={({ isActive, isPending }) => {
                if (isPending) {
                    return `${className} text-muted`;
                }
                if (isActive) {
                    return `${className} text-decoration-underline`;
                }
                return className;
            }}
        >
            {route.icon}
            {route.name}
        </NavLink>
    );
};
