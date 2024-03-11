import { Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { UserService } from "api/services";
import { useAuthContext } from "contexts/AuthContext";
import { useThemeContext } from "contexts/ThemeContext";
import { getFormattedTitleAndMessage } from "lib/utils/error";
import { cn } from "lib/utils/style";
import type { FC, Key } from "react";
import { Fragment, useMemo, useState } from "react";
import { BiPlusMedical } from "react-icons/bi";
import { BsChevronDown, BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { MdOutlineDesktopWindows, MdRefresh } from "react-icons/md";
import { RiToolsLine } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { HeaderItem, HeaderMenu } from "types/header";

export const Header: FC = () => {

    const { setAccessToken } = useAuthContext();

    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const location = useLocation();

    const { theme, toggleTheme } = useThemeContext();

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
                            console.error("Logout failed", getFormattedTitleAndMessage(e));
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

    const [ isMenuOpen, setIsMenuOpen ] = useState(false);

    const handleItemAction = async (item: HeaderItem) => {
        switch (item.type) {
            case "route":
                navigate(item.path);
                break;
            case "action":
                await item.handleAction();
                break;
        }
        setIsMenuOpen(false);
    };

    const handleMenuAction = async (menu: HeaderMenu, key: Key) => {
        const item = menu.children.find(child => child.name === key);
        if (item) {
            await handleItemAction(item);
        }
    };

    const isHeaderItemActive = (item: HeaderItem): boolean => {
        return item.type === "route" && matchPath(item.path, location.pathname) !== null;
    };

    const isHeaderMenuActive = (menu: HeaderMenu): boolean => {
        return menu.children.some(isHeaderItemActive);
    };

    const brand = (
        <NavbarBrand>
            <Image
                className="object-cover h-full p-3.5"
                src="/logo.svg"
                alt="The logo of the Personal-API dashboard"
                radius="none"
                disableSkeleton
            />
            <h1 className="lg:block md:hidden">Dashboard</h1>
        </NavbarBrand>
    );

    const renderNavbarMenuItem = (item: HeaderItem | HeaderMenu, isLastMenuChild = false) => {
        switch (item.type) {
            case "route":
            case "action":
                return (
                    <NavbarMenuItem key={item.name}>
                        <Button
                            data-active={isHeaderItemActive(item)}
                            className={cn(
                                "min-w-0 p-0 text-lg bg-transparent data-[hover=true]:bg-transparent",
                                "data-[active=true]:underline decoration-danger underline-offset-4",
                                isLastMenuChild && "mb-2",
                                item.danger && "text-danger"
                            )}
                            radius="sm"
                            disableRipple
                            onPress={() => handleItemAction(item)}
                        >
                            {item.name}
                        </Button>
                    </NavbarMenuItem>
                );
            case "menu":
                return (
                    <Fragment key={item.name}>
                        <li className="flex items-center gap-2 text-small text-gray-600">
                            {item.name}
                            <Divider className="grow w-auto bg-gray-600" />
                        </li>
                        {item.children.map((child, i) => renderNavbarMenuItem(child, i === item.children.length - 1))}
                    </Fragment>
                );
        }
    };

    const renderNavbarContentItem = (item: HeaderItem | HeaderMenu) => {
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
                                    className={cn(
                                        isHeaderItemActive(child) && "text-danger data-[hover=true]:text-danger",
                                        child.danger && "text-danger"
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
    };

    return (
        <Navbar
            position={isMenuOpen ? "sticky" : "static"}
            isBordered
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            classNames={{
                menu: "overflow-y-hidden",
                menuItem: "",
                brand: "h-full d-flex items-center text-lg font-bold",
                content: "gap-6",
                item: [
                    "flex relative h-full items-center",
                    "data-[active=true]:after:content-[''] data-[active=true]:after:absolute data-[active=true]:after:bottom-0 data-[active=true]:after:left-0 data-[active=true]:after:right-0",
                    "data-[active=true]:after:h-[2px] data-[active=true]:after:rounded-[2px] data-[active=true]:after:bg-danger"
                ]
            }}
        >
            {/* Desktop layout */}
            <NavbarContent justify="start" className="hidden md:flex">
                {brand}
            </NavbarContent>
            <NavbarContent justify="center" className="hidden md:flex">
                {headerItems.map(renderNavbarContentItem)}
            </NavbarContent>

            {/* Mobile layout */}
            <NavbarContent justify="start" className="md:hidden">
                <NavbarMenuToggle />
            </NavbarContent>
            <NavbarMenu>
                {headerItems.map(item => renderNavbarMenuItem(item))}
            </NavbarMenu>
            <NavbarContent justify="center" className="md:hidden">
                {brand}
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <Button
                        variant="flat"
                        isIconOnly
                        onPress={toggleTheme}
                    >
                        {theme === "dark"
                            ? <BsFillMoonFill size={20} />
                            : <BsFillSunFill size={20} />
                        }
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
};
