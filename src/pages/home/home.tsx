import { useQuery } from "@tanstack/react-query";
import { Page } from "components/common/page";
import { StatusCards } from "components/home/status-cards";
import { Skeleton } from "components/ui/skeleton";
import type { homeLoader } from "pages/home/home.loader";
import { healthQueryOptions, infoQueryOptions } from "pages/home/home.loader";
import type { FC } from "react";
import { useLoaderData } from "react-router-dom";
import type { QueryLoaderFunctionData } from "types/loader";

export const Home: FC = () => {
    const { info: initialInfo, health: initialHealth } = useLoaderData() as QueryLoaderFunctionData<
        typeof homeLoader
    >;

    const infoQuery = useQuery({
        ...infoQueryOptions,
        initialData: initialInfo ?? undefined
    });

    const healthQuery = useQuery({
        ...healthQueryOptions,
        initialData: initialHealth ?? undefined
    });

    return (
        <Page title="Home">
            <div className="h-full w-full px-[5%] py-16">
                <div className="flex flex-col gap-20">
                    <div>
                        <h1 className="text-3xl font-medium">
                            {infoQuery.isLoading && (
                                <Skeleton className="mt-1.5 h-[1lh] w-[32ch]" />
                            )}
                            {infoQuery.isSuccess && (
                                <>
                                    Welcome to the{" "}
                                    <strong className="text-nowrap bg-gradient-to-b from-[hsl(347deg_84%_50%)] to-pink-600 bg-clip-text font-bold text-transparent">
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
                                    {infoQuery.data.app.stage.toUpperCase()} v
                                    {infoQuery.data.app.version}
                                </>
                            )}
                        </h2>
                        <p className="mt-4">
                            I use this API to store data about all my projects and skills. Its
                            dashboard allows me to manage all this data as well as its health.
                        </p>
                    </div>
                    {healthQuery.isSuccess && <StatusCards data={healthQuery.data} />}
                </div>
            </div>
        </Page>
    );
};
