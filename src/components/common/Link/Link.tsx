import { Link as NextUILink } from "@nextui-org/react";
import type { ComponentProps, FC, PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";
import type { Route } from "types/app";

type Props = {
    route: Route;
    uiProps?: ComponentProps<typeof NextUILink>;
};

export const Link: FC<PropsWithChildren<Props>> = props => {
    return (
        <NextUILink as="div" {...props.uiProps}>
            <NavLink to={props.route.path}>
                {props.children ?? props.route.name}
            </NavLink>
        </NextUILink>
    );
};
