import { useQuery } from "@tanstack/react-query";
import { Page } from "components/common/page";
import { Skeleton } from "components/ui/skeleton";
import { infoQueryOptions } from "pages/home/home.loader";
import type { FC } from "react";

export const Home: FC = () => {
    const infoQuery = useQuery(infoQueryOptions);

    return (
        <Page title="Home">
            <div className="size-full px-[5%] py-16">
                <h1 className="text-3xl font-medium">
                    {infoQuery.isLoading && <Skeleton className="mt-1.5 h-[1lh] w-[32ch]" />}
                    {infoQuery.isSuccess && (
                        <>
                            Welcome to the{" "}
                            <strong className="bg-gradient-to-b from-[hsl(347deg_84%_50%)] to-pink-600 bg-clip-text font-bold text-nowrap text-transparent">
                                {infoQuery.data.app.name}
                            </strong>{" "}
                            dashboard&nbsp;!
                        </>
                    )}
                </h1>
                <h2 className="text-lg">
                    {infoQuery.isLoading && <Skeleton className="mt-1.5 h-[1lh] w-48" />}
                    {infoQuery.isSuccess && (
                        <>
                            {infoQuery.data.app.stage.toUpperCase()} v{infoQuery.data.app.version}
                        </>
                    )}
                </h2>
                <p className="mt-4">
                    I use this API to store data about all my projects and skills. Its dashboard
                    allows me to manage all this data.
                </p>
            </div>
        </Page>
    );
};
