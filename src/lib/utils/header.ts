import type { Location } from "react-router-dom";
import { matchPath } from "react-router-dom";
import type { HeaderMenu, HeaderRouteItem } from "types/header";

export const isHeaderRouteItemActive = (item: HeaderRouteItem, location: Location): boolean => {
    return matchPath(item.path, location.pathname) !== null;
};

export const isHeaderMenuActive = (menu: HeaderMenu, location: Location): boolean => {
    return menu.children.some(i => i.type === "route" && isHeaderRouteItemActive(i, location));
};
