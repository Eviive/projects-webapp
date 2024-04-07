import {
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle
} from "components/ui/navigation-menu";
import { isHeaderRouteItemActive } from "lib/utils/header";
import { cn } from "lib/utils/style";
import type { FC } from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { HeaderItem as HeaderItemType } from "types/header";

type Props = {
    item: HeaderItemType;
};

export const HeaderItem: FC<Props> = ({ item }) => {
    const location = useLocation();

    const className = cn(
        navigationMenuTriggerStyle(),
        "cursor-pointer",
        item.danger && "text-danger hover:text-danger focus:text-danger"
    );

    return (
        <NavigationMenuItem key={item.name}>
            {item.type === "route" && (
                <NavigationMenuLink
                    asChild
                    className={className}
                    active={isHeaderRouteItemActive(item, location)}
                >
                    <NavLink to={item.path}>{item.name}</NavLink>
                </NavigationMenuLink>
            )}

            {item.type === "action" && (
                <NavigationMenuLink className={className} onClick={item.handleAction}>
                    {item.name}
                </NavigationMenuLink>
            )}
        </NavigationMenuItem>
    );
};
