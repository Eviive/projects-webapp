import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { UserService } from "api/services";
import { useAuthContext } from "contexts/AuthContext";
import { formatClassNames, getTitleAndMessage } from "libs/utils";
import type { FC, Key } from "react";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { BiPlusMedical } from "react-icons/bi";
import { BsChevronDown } from "react-icons/bs";
import { MdOutlineDesktopWindows, MdRefresh } from "react-icons/md";
import { RiToolsLine } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import type { HeaderItem, HeaderMenu } from "types/header";

export const Header: FC = () => {

    const { setAccessToken } = useAuthContext();

    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const location = useLocation();

    const headerItems = useMemo<(HeaderItem | HeaderMenu)[]>(() => ([
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

    const handleItemAction = (item: HeaderItem) => {
        switch (item.type) {
            case "route":
                navigate(item.path);
                break;
            case "action":
                item.handleAction();
                break;
        }
    };

    const handleMenuAction = (menu: HeaderMenu, key: Key) => {
        const item = menu.children.find(child => child.name === key);
        if (item) {
            handleItemAction(item);
        }
    };

    const isHeaderItemActive = (item: HeaderItem): boolean => {
        return item.type === "route" && matchPath(item.path, location.pathname) !== null;
    };

    const isHeaderMenuActive = (menu: HeaderMenu): boolean => {
        return menu.children.some(isHeaderItemActive);
    };

    return (
        <Navbar
            position="static"
            isBordered
            classNames={{
                brand: "h-full d-flex items-center text-lg font-bold",
                content: "gap-6",
                item: "flex relative h-full items-center data-[active=true]:after:content-[''] data-[active=true]:after:absolute data-[active=true]:after:bottom-0 data-[active=true]:after:left-0 data-[active=true]:after:right-0 data-[active=true]:after:h-[2px] data-[active=true]:after:rounded-[2px] data-[active=true]:after:bg-danger"
            }}
        >
            <NavbarContent justify="start">
                <NavbarBrand>
                    <Image
                        className="object-cover h-full p-3"
                        src="/logo.svg"
                        alt="The logo of the Personal-API dashboard"
                        radius="none"
                        disableSkeleton
                    />
                    <h1>Dashboard</h1>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent justify="center">
                {headerItems.map(item => {
                    switch (item.type) {
                        case "route":
                        case "action":
                            return (
                                <NavbarItem key={item.name} isActive={isHeaderItemActive(item)}>
                                    <Button
                                        className="min-w-0 p-0 text-medium bg-transparent data-[hover=true]:bg-transparent"
                                        variant="light"
                                        radius="sm"
                                        disableRipple
                                        onPress={() => handleItemAction(item)}
                                    >
                                        {item.name}
                                    </Button>
                                </NavbarItem>
                            );
                        case "menu":
                            return (
                                <Dropdown key={item.name}>
                                    <NavbarItem isActive={isHeaderMenuActive(item)}>
                                        <DropdownTrigger>
                                            <Button
                                                className="min-w-0 p-0 text-medium bg-transparent data-[hover=true]:bg-transparent gap-1.5"
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
                                        onAction={key => handleMenuAction(item, key)}
                                    >
                                        {item.children.map(child => (
                                            <DropdownItem
                                                key={child.name}
                                                className={formatClassNames(
                                                    child.danger && "text-danger",
                                                    isHeaderItemActive(child) && "text-danger data-[hover=true]:text-danger"
                                                )}
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
