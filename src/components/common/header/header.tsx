import { UserService } from "api/services/user";
import { HeaderButton } from "components/common/header/header-button";
import { HeaderLink } from "components/common/header/header-link";
import { HeaderThemeSwitcher } from "components/common/header/header-theme-switcher";
import { Button } from "components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "components/ui/sheet";
import { useAuthContext } from "contexts/auth-context";
import { getFormattedTitleAndMessage } from "libs/utils/error";
import { cn } from "libs/utils/style";
import { type FC } from "react";
import { LuActivity, LuFolder, LuHome, LuLogOut, LuPanelLeft, LuUserCog2 } from "react-icons/lu";
import { toast } from "sonner";

export type HeaderType = "sidebar" | "header";

export const Header: FC = () => {
    const { setAccessToken } = useAuthContext();

    const handleLogout = async () => {
        try {
            await UserService.logout();
        } catch (e) {
            console.error("Logout failed", getFormattedTitleAndMessage(e));
        } finally {
            setAccessToken("");
            toast.success("You have been logged out");
        }
    };

    const sidebarNavClasses = "flex flex-col items-center gap-4 px-2 sm:py-5";

    const sidebarItemClasses =
        "flex h-9 w-9 items-center justify-center rounded-lg bg-background p-0 text-muted-foreground transition-colors hover:bg-background hover:text-foreground md:h-8 md:w-8 focus-visible:ring-offset-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

    const getSidebarItemClasses = ({ isActive }: { isActive: boolean }): string =>
        cn(sidebarItemClasses, isActive && "bg-accent text-accent-foreground");

    const headerNavClasses = "grid gap-6 text-lg font-medium";

    const headerItemClasses =
        "w-full flex justify-start items-center rounded-md gap-4 bg-background px-2.5 py-0 h-auto text-base text-muted-foreground transition-colors hover:text-foreground hover:bg-background focus-visible:ring-offset-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

    const getHeaderItemClasses = ({ isActive }: { isActive: boolean }): string =>
        cn(headerItemClasses, isActive && "text-foreground");

    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className={sidebarNavClasses}>
                    <div className="flex h-8 w-8 items-center justify-center">
                        <img
                            className="w-full object-cover"
                            src="/logo.svg"
                            alt="The logo of the Personal-API dashboard"
                        />
                        <span className="sr-only">Dashboard</span>
                    </div>

                    <HeaderLink
                        type="sidebar"
                        title="Dashboard"
                        to="/"
                        icon={<LuHome className="h-6 w-6" />}
                        className={getSidebarItemClasses}
                    />

                    <HeaderLink
                        type="sidebar"
                        title="Projects"
                        to="/projects"
                        icon={<LuFolder className="h-6 w-6" />}
                        className={getSidebarItemClasses}
                    />

                    <HeaderLink
                        type="sidebar"
                        title="Skills"
                        to="/skills"
                        icon={<LuUserCog2 className="h-6 w-6" />}
                        className={getSidebarItemClasses}
                    />

                    <HeaderLink
                        type="sidebar"
                        title="Health"
                        to="/health"
                        icon={<LuActivity className="h-6 w-6" />}
                        className={getSidebarItemClasses}
                    />
                </nav>
                <nav className={cn(sidebarNavClasses, "mt-auto")}>
                    <HeaderThemeSwitcher type="sidebar" className={sidebarItemClasses} />

                    <HeaderButton
                        type="sidebar"
                        title="Logout"
                        handleClick={handleLogout}
                        icon={<LuLogOut className="h-6 w-6" />}
                        className={sidebarItemClasses}
                    />
                </nav>
            </aside>
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:hidden sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <Sheet>
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
                                    src="/logo.svg"
                                    alt="The logo of the Personal-API dashboard"
                                />
                                <span className="sr-only">Dashboard</span>
                            </div>

                            <HeaderLink
                                type="header"
                                title="Dashboard"
                                to="/"
                                icon={<LuHome className="h-6 w-6" />}
                                className={getHeaderItemClasses}
                            />

                            <HeaderLink
                                type="header"
                                title="Projects"
                                to="/projects"
                                icon={<LuFolder className="h-6 w-6" />}
                                className={getHeaderItemClasses}
                            />

                            <HeaderLink
                                type="header"
                                title="Skills"
                                to="/skills"
                                icon={<LuUserCog2 className="h-6 w-6" />}
                                className={getHeaderItemClasses}
                            />

                            <HeaderLink
                                type="header"
                                title="Health"
                                to="/health"
                                icon={<LuActivity className="h-6 w-6" />}
                                className={getHeaderItemClasses}
                            />
                        </nav>
                        <nav className={cn(headerNavClasses, "mt-auto")}>
                            <HeaderThemeSwitcher type="header" className={headerItemClasses} />

                            <HeaderButton
                                type="header"
                                title="Logout"
                                handleClick={handleLogout}
                                icon={<LuLogOut className="h-6 w-6" />}
                                className={headerItemClasses}
                            />
                        </nav>
                    </SheetContent>
                </Sheet>
            </header>
        </>
    );
};
