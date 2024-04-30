import { PortfolioService } from "api/services/portfolio";
import { UserService } from "api/services/user";
import { HeaderButton } from "components/common/header/header-button";
import { HeaderLink } from "components/common/header/header-link";
import { HeaderThemeSwitcher } from "components/common/header/header-theme-switcher";
import { Button } from "components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "components/ui/sheet";
import { clearAuthContext } from "contexts/auth-context";
import { getDetail } from "libs/utils/error";
import { cn } from "libs/utils/style";
import { type FC, useEffect, useState } from "react";
import {
    LuActivity,
    LuFolder,
    LuHome,
    LuLogOut,
    LuPanelLeft,
    LuRefreshCw,
    LuUserCog2
} from "react-icons/lu";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

export type HeaderType = "sidebar" | "header";

export const Header: FC = () => {
    const [open, setOpen] = useState(false);

    const { pathname } = useLocation();

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const logoSrc = `${import.meta.env.VITE_ROUTER_BASE_URL ?? ""}/logo.svg`;

    const sidebarNavClasses = "flex flex-col items-center gap-4 px-2 sm:py-5";

    const sidebarItemClasses =
        "flex h-9 w-9 items-center justify-center rounded-lg bg-background p-0 " +
        "text-muted-foreground ring-offset-background transition-colors hover:bg-background hover:text-foreground " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

    const getSidebarItemClasses = ({ isActive }: { isActive: boolean }): string =>
        cn(sidebarItemClasses, isActive && "bg-accent text-accent-foreground hover:bg-accent");

    const headerNavClasses = "flex flex-col gap-6 text-lg font-medium";

    const headerItemClasses =
        "flex h-auto w-full items-center justify-start gap-4 rounded-md bg-background px-2.5 py-0 " +
        "text-base text-muted-foreground ring-offset-background transition-colors hover:bg-background hover:text-foreground " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

    const getHeaderItemClasses = ({ isActive }: { isActive: boolean }): string =>
        cn(headerItemClasses, isActive && "text-foreground");

    const iconClasses = "h-6 w-6 shrink-0";

    const handleRevalidate = async () => {
        try {
            await PortfolioService.revalidate();
            toast.success("Portfolio revalidated successfully.");
        } catch (e) {
            console.error("Revalidation failed:", getDetail(e));
        }
    };

    const handleLogout = async () => {
        try {
            await UserService.logout();
        } catch (e) {
            console.error("Logout failed:", getDetail(e));
        } finally {
            clearAuthContext();
            toast.success("You have been logged out.");
        }
    };

    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className={sidebarNavClasses}>
                    <div className="flex h-8 w-8 items-center justify-center">
                        <img
                            className="w-full object-cover"
                            src={logoSrc}
                            alt="The logo of the Personal-API dashboard"
                        />
                        <span className="sr-only">Dashboard</span>
                    </div>

                    <HeaderLink
                        type="sidebar"
                        title="Dashboard"
                        to="/"
                        icon={<LuHome className={iconClasses} />}
                        className={getSidebarItemClasses}
                    />

                    <HeaderLink
                        type="sidebar"
                        title="Projects"
                        to="/projects"
                        icon={<LuFolder className={iconClasses} />}
                        className={getSidebarItemClasses}
                    />

                    <HeaderLink
                        type="sidebar"
                        title="Skills"
                        to="/skills"
                        icon={<LuUserCog2 className={iconClasses} />}
                        className={getSidebarItemClasses}
                    />

                    <HeaderLink
                        type="sidebar"
                        title="Health"
                        to="/health"
                        icon={<LuActivity className={iconClasses} />}
                        className={getSidebarItemClasses}
                    />

                    <HeaderButton
                        type="sidebar"
                        title="Revalidate portfolio"
                        handleClick={handleRevalidate}
                        icon={<LuRefreshCw className={iconClasses} />}
                        className={sidebarItemClasses}
                    />
                </nav>
                <nav className={cn(sidebarNavClasses, "mt-auto")}>
                    <HeaderThemeSwitcher
                        type="sidebar"
                        classNames={{ item: sidebarItemClasses, icon: iconClasses }}
                    />

                    <HeaderButton
                        type="sidebar"
                        title="Logout"
                        handleClick={handleLogout}
                        icon={<LuLogOut className={iconClasses} />}
                        className={sidebarItemClasses}
                    />
                </nav>
            </aside>
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:hidden sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="outline" className="sm:hidden">
                            <LuPanelLeft className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col sm:max-w-xs">
                        <nav className={headerNavClasses}>
                            <div className="flex h-10 w-10 items-center justify-center">
                                <img
                                    className="w-full object-cover"
                                    src={logoSrc}
                                    alt="The logo of the Personal-API dashboard"
                                />
                                <span className="sr-only">Dashboard</span>
                            </div>

                            <HeaderLink
                                type="header"
                                title="Dashboard"
                                to="/"
                                icon={<LuHome className={iconClasses} />}
                                className={getHeaderItemClasses}
                            />

                            <HeaderLink
                                type="header"
                                title="Projects"
                                to="/projects"
                                icon={<LuFolder className={iconClasses} />}
                                className={getHeaderItemClasses}
                            />

                            <HeaderLink
                                type="header"
                                title="Skills"
                                to="/skills"
                                icon={<LuUserCog2 className={iconClasses} />}
                                className={getHeaderItemClasses}
                            />

                            <HeaderLink
                                type="header"
                                title="Health"
                                to="/health"
                                icon={<LuActivity className={iconClasses} />}
                                className={getHeaderItemClasses}
                            />

                            <HeaderButton
                                type="header"
                                title="Revalidate portfolio"
                                handleClick={handleRevalidate}
                                icon={<LuRefreshCw className={iconClasses} />}
                                className={headerItemClasses}
                            />
                        </nav>
                        <nav className={cn(headerNavClasses, "mt-auto")}>
                            <HeaderThemeSwitcher
                                type="header"
                                classNames={{ item: headerItemClasses, icon: iconClasses }}
                            />

                            <HeaderButton
                                type="header"
                                title="Logout"
                                handleClick={handleLogout}
                                icon={<LuLogOut className={iconClasses} />}
                                className={headerItemClasses}
                            />
                        </nav>
                    </SheetContent>
                </Sheet>
            </header>
        </>
    );
};
