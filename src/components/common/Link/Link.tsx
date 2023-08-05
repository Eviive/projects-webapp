import type { FC } from "react";
import { NavLink } from "react-router-dom";
import type { Route } from "types/app";
import { formatClassNames } from "utils/components";

type Props = {
    route: Route;
    className?: string;
    activeClassName?: string;
    pendingClassName?: string;
};

export const Link: FC<Props> = ({ route, className, activeClassName, pendingClassName }) => {
    return (
        <NavLink
            to={route.path}
            className={({ isActive, isPending }) =>
                formatClassNames(
                    className,
                    isActive && activeClassName,
                    isPending && pendingClassName
                )
            }
        >
            {route.icon}
            {route.name}
        </NavLink>
    );
};
