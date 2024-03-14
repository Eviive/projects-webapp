import { NavigationMenuLink } from "components/ui/navigation-menu";
import { isHeaderRouteItemActive } from "lib/utils/header";
import { cn } from "lib/utils/style";
import type { FC } from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { HeaderMenuItem as HeaderMenuItemType } from "types/header";

type Props = {
    item: HeaderMenuItemType;
};

export const HeaderMenuItem: FC<Props> = ({ item }) => {

    const location = useLocation();

    const className = cn(
        "h-full w-full block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
        item.danger && "text-danger hover:text-danger focus:text-danger"
    );

    if (item.type === "route") {
        const isItemActive = isHeaderRouteItemActive(item, location);

        return (
            <NavigationMenuLink
                asChild
                active={isItemActive}
            >
                <NavLink
                    to={item.path}
                    className={cn(
                        className,
                        isItemActive && "bg-accent text-accent-foreground"
                    )}
                >
                    <span className="text-sm font-medium leading-none">{item.name}</span>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {item.description}
                    </p>
                </NavLink>
            </NavigationMenuLink>
        );
    }

    return (
        <NavigationMenuLink
            className={className}
            onClick={item.handleAction}
        >
            <span className="text-sm font-medium leading-none">{item.name}</span>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {item.description}
            </p>
        </NavigationMenuLink>
    );
};
