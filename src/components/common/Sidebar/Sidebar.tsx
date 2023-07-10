import { useQueryClient } from "@tanstack/react-query";
import { UserService } from "api/services";
import { Anchor, Link } from "components/common";
import { useAuthContext } from "contexts/AuthContext";
import { FC } from "react";
import toast from "react-hot-toast";
import { BsBriefcaseFill } from "react-icons/bs";
import { FaHome, FaInfo, FaTools } from "react-icons/fa";
import { GiHealthNormal } from "react-icons/gi";
import { MdRefresh } from "react-icons/md";
import { TbLogout } from "react-icons/tb";
import { Route } from "types/app";
import { getTitleAndMessage } from "utils/errors";

import styles from "./sidebar.module.scss";

const routes: Route[] = [
    {
        name: "Home",
        path: "/",
        icon: <FaHome />
    },
    {
        name: "Projects",
        path: "/projects",
        icon: <BsBriefcaseFill />
    },
    {
        name: "Skills",
        path: "/skills",
        icon: <FaTools />
    },
    {
        name: "Health",
        path: "/health",
        icon: <GiHealthNormal />
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
            console.error("Logout failed :", getTitleAndMessage(e));
        } finally {
            setAccessToken("");
            toast.success("You have been logged out");
        }
    };

    return (
        <nav className={styles.sidebar}>
            <ul>
                {routes.map((route, index) => (
                    <li key={index}>
                        <Link
                            route={route}
                            className={styles.sidebarItem}
                            activeClassName={styles.active}
                            pendingClassName={styles.pending}
                        />
                    </li>
                ))}
            </ul>
            <ul>
                <li>
                    <button className={styles.sidebarItem} onClick={handleRefresh}>
                        <MdRefresh />
                        Refresh data
                    </button>
                </li>
                <li>
                    <Anchor href={`${import.meta.env.VITE_API_BASE_URL}/documentation`} className={styles.sidebarItem}>
                        <FaInfo />
                        API Documentation
                    </Anchor>
                </li>
                <li>
                    <button className={styles.sidebarItem} onClick={handleLogout}>
                        <TbLogout />
                        Sign out
                    </button>
                </li>
            </ul>
        </nav>
    );
};
