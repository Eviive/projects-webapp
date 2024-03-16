import { HeaderMenuItem } from "components/common/header/header-menu-item";
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger } from "components/ui/navigation-menu";
import { isHeaderMenuActive } from "lib/utils/header";
import type { FC } from "react";
import { useLocation } from "react-router-dom";
import type { HeaderMenu as HeaderMenuType } from "types/header";

type Props = {
    menu: HeaderMenuType;
};

export const HeaderMenu: FC<Props> = ({ menu }) => {

    const location = useLocation();

    const isMenuActive = isHeaderMenuActive(menu, location);

    return (
        <NavigationMenuItem>
            <NavigationMenuTrigger {...isMenuActive && { "data-active": "" }}>
                {menu.name}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
                <ul className="grid gap-3 p-6 h-[320px] w-[500px] grid-cols-[.75fr_1fr] grid-rows-3">
                    <li className="row-span-3 flex h-full w-full flex-col rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline shadow-md">
                        {menu.icon}
                        <span className="mb-2 mt-4 text-lg font-medium">{menu.name}</span>
                        <p className="text-sm text-muted-foreground">{menu.description}</p>
                    </li>
                    {menu.children.map(child => (
                        <li key={child.name}>
                            <HeaderMenuItem item={child} />
                        </li>
                    ))}
                </ul>
            </NavigationMenuContent>
        </NavigationMenuItem>
    );
};
