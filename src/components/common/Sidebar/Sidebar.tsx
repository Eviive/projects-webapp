import { useQueryClient } from "@tanstack/react-query";
import { UserService } from "api/services";
import { Link } from "components/common";
import { useAuthContext } from "contexts/AuthContext";
import { getTitleAndMessage } from "libs/utils";
import type { FC } from "react";
import toast from "react-hot-toast";
import { BsBriefcaseFill } from "react-icons/bs";
import { FaHome, FaTools } from "react-icons/fa";
import { GiHealthNormal } from "react-icons/gi";
import { MdRefresh } from "react-icons/md";
import { TbLogout } from "react-icons/tb";
import type { Route } from "types/app";

const classNames = {
    sidebar: "z-50 fixed top-0 w-sidebar h-full flex flex-col justify-between font-medium bg-content2/60 backdrop-blur shadow overflow-x-hidden transition-width duration-300 hover:w-sidebar-expanded",
    sidebarItem: "w-sidebar-expanded flex items-center gap-1.5 select-none transition-colors duration-300 hover:bg-content3/40 hover:shadow-inner",
    sidebarItemActive: "bg-content3/40 shadow-inner",
    sidebarIcon: "w-sidebar h-sidebar-item p-3.5 text-foreground"
};

const routes: Route[] = [
    {
        name: "Home",
        path: "/",
        icon: <FaHome className={classNames.sidebarIcon} />
    },
    {
        name: "Projects",
        path: "/projects",
        icon: <BsBriefcaseFill className={classNames.sidebarIcon} />
    },
    {
        name: "Skills",
        path: "/skills",
        icon: <FaTools className={classNames.sidebarIcon} />
    },
    {
        name: "Health",
        path: "/health",
        icon: <GiHealthNormal className={classNames.sidebarIcon} />
    }
];

export const Sidebar: FC = () => {

    const { setAccessToken } = useAuthContext();

    const queryClient = useQueryClient();

    const handleRefresh = async () => {
        await queryClient.invalidateQueries();
    };

    const handleLogout = async () => {
        try {
            await UserService.logout();
        } catch (e) {
            console.error("Logout failed", getTitleAndMessage(e));
        } finally {
            setAccessToken("");
            toast.success("You have been logged out");
        }
    };

    return (
        <nav className={classNames.sidebar}>
            <ul>
                {routes.map(route => (
                    <li key={route.name}>
                        <Link
                            route={route}
                            className={classNames.sidebarItem}
                            activeClassName={classNames.sidebarItemActive}
                        />
                    </li>
                ))}
            </ul>
            <ul>
                <li>
                    <button className={classNames.sidebarItem} onClick={handleRefresh}>
                        <MdRefresh className={classNames.sidebarIcon} />
                        Refresh data
                    </button>
                </li>
                <li>
                    <button className={classNames.sidebarItem} onClick={handleLogout}>
                        <TbLogout className={classNames.sidebarIcon} />
                        Sign out
                    </button>
                </li>
            </ul>
        </nav>
    );
};
