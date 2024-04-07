import { useQuery } from "@tanstack/react-query";
import { HealthService } from "api/services/health";
import { Page } from "components/common/page";
import { StatusCards } from "components/home/status-cards";
import { Skeleton } from "components/ui/skeleton";
import type { FC } from "react";

export const Home: FC = () => {
    const queryInfo = useQuery({
        queryFn: HealthService.info,
        queryKey: ["info"]
    });

    const queryHealth = useQuery({
        queryFn: HealthService.health,
        queryKey: ["health"]
    });

    return (
        <Page title="Home">
            <div className="h-full w-full px-[5%] py-16">
                <div className="flex flex-col gap-20">
                    <div>
                        <h1 className="text-3xl font-medium">
                            Welcome to the{" "}
                            <strong className="bg-gradient-to-b from-[hsl(347deg_84%_50%)] to-pink-600 bg-clip-text font-bold text-transparent">
                                Personal-API
                            </strong>{" "}
                            dashboard !
                        </h1>
                        {queryInfo.isLoading && <Skeleton className="h-unit-lg mt-1.5 w-48" />}
                        {queryInfo.isSuccess && (
                            <h2 className="text-lg">
                                {queryInfo.data.app.stage.toUpperCase()} v
                                {queryInfo.data.app.version}
                            </h2>
                        )}
                        <p className="mt-4">
                            I use this API to store data about all my projects and skills. Its
                            dashboard allows me to manage all this data as well as its health.
                        </p>
                    </div>
                    {queryHealth.isSuccess && <StatusCards data={queryHealth.data} />}
                </div>
            </div>
        </Page>
    );
};
