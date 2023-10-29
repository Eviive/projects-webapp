import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { UserService } from "api/services";
import { Link } from "components/common";
import { useAuthContext } from "contexts/AuthContext";
import { getTitleAndMessage } from "libs/utils";
import type { FC, Key } from "react";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { BiPlusMedical } from "react-icons/bi";
import { BsChevronDown } from "react-icons/bs";
import { MdOutlineDesktopWindows, MdRefresh } from "react-icons/md";
import { RiToolsLine } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import type { HeaderItem, HeaderMenu } from "types/header";

export const Header: FC = () => {

    const { setAccessToken } = useAuthContext();

    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const headerItems: (HeaderItem | HeaderMenu)[] = useMemo(() => ([
        {
            name: "Home",
            type: "route",
            path: "/"
        },
        {
            name: "Data",
            type: "menu",
            children: [
                {
                    name: "Projects",
                    type: "route",
                    path: "/projects",
                    icon: <MdOutlineDesktopWindows size={22} />
                },
                {
                    name: "Skills",
                    type: "route",
                    path: "/skills",
                    icon: <RiToolsLine size={22} />
                }
            ]
        },
        {
            name: "Monitoring",
            type: "menu",
            children: [
                {
                    name: "Health",
                    type: "route",
                    path: "/health",
                    icon: <BiPlusMedical size={22} />
                }
            ]
        },
        {
            name: "Management",
            type: "menu",
            children: [
                {
                    name: "Refresh",
                    type: "action",
                    icon: <MdRefresh size={22} />,
                    handleAction: () => queryClient.invalidateQueries()
                },
                {
                    name: "Logout",
                    type: "action",
                    icon: <TbLogout size={22} />,
                    handleAction: async () => {
                        try {
                            await UserService.logout();
                        } catch (e) {
                            console.error("Logout failed", getTitleAndMessage(e));
                        } finally {
                            setAccessToken("");
                            toast.success("You have been logged out");
                        }
                    },
                    danger: true
                }
            ]
        }
    ]), [ queryClient, setAccessToken ]);

    const handleMenuAction = (key: Key, menu: HeaderMenu) => {
        const item = menu.children.find(child => child.name === key);
        if (!item) return;
        switch (item.type) {
            case "route":
                navigate(item.path);
                break;
            case "action":
                item.handleAction();
                break;
        }
    };

    // {item.children
    //     .filter(child => child.type === "route")
    //     .find(child => child.type === "route" && matchPath(child.path, window.location.pathname))
    //     ? "ACTIVE" : "INACTIVE"}

    return (
        <Navbar position="static" isBordered>
            <NavbarBrand className="h-full d-flex items-center text-lg font-bold">
                <Image
                    className="object-cover h-full p-3"
                    src="/logo.svg"
                    alt="The logo of the Personal-API dashboard"
                    radius="none"
                    disableSkeleton
                />
                <h1>Dashboard</h1>
            </NavbarBrand>
            <NavbarContent justify="center" className="gap-6">
                {headerItems.map(item => {
                    switch (item.type) {
                        case "route":
                        case "action":
                            return (
                                <NavbarItem key={item.name}>
                                    <Button
                                        as={item.type === "route" ? "div" : undefined}
                                        className="min-w-0 p-0 text-medium bg-transparent data-[hover=true]:bg-transparent"
                                        variant="light"
                                        radius="sm"
                                        disableRipple
                                        onPress={item.type === "action" ? item.handleAction : undefined}
                                    >
                                        { item.type === "route"
                                            ? <Link route={item} uiProps={{ className: "text-inherit" }} />
                                            : item.name
                                        }
                                    </Button>
                                </NavbarItem>
                            );
                        case "menu":
                            return (
                                <Dropdown key={item.name}>
                                    <NavbarItem>
                                        <DropdownTrigger>
                                            <Button
                                                className="min-w-0 p-0 gap-1.5 text-medium bg-transparent data-[hover=true]:bg-transparent"
                                                variant="light"
                                                radius="sm"
                                                disableRipple
                                                endContent={<BsChevronDown />}
                                            >
                                                {item.name}
                                            </Button>
                                        </DropdownTrigger>
                                    </NavbarItem>
                                    <DropdownMenu
                                        aria-label={item.name}
                                        variant="flat"
                                        onAction={key => handleMenuAction(key, item)}
                                    >
                                        {item.children.map(child => (
                                            <DropdownItem
                                                key={child.name}
                                                className={child.danger ? "text-danger" : undefined}
                                                color={child.danger ? "danger" : undefined}
                                                startContent={child.icon}
                                            >
                                                {child.name}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            );
                    }
                })}
            </NavbarContent>
            <NavbarContent justify="end" />
        </Navbar>
    );
};
