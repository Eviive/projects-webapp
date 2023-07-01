import { FC } from "react";
import { NavLink } from "react-router-dom";
import { Route } from "types/app";

type Props = {
    route: Route;
    className?: string;
    activeClassName?: string;
};

export const Link: FC<Props> = ({ route, className, activeClassName }) => {
    return (
        <NavLink
            to={route.path}
            className={({ isActive, isPending }) => {
                if (isActive || isPending) {
                    return `${className} ${activeClassName}`;
                }
                return className;
            }}
        >
            {route.icon}
            {route.name}
        </NavLink>
    );
};
