import { useQuery } from "@tanstack/react-query";
import { HealthService } from "api/services";
import { Loader, Page } from "components/common";
import { StatusCards } from "components/home";
import type { FC } from "react";

export const Home: FC = () => {

    const queryInfo = useQuery([ "info" ], HealthService.info);

    const queryHealth = useQuery([ "health" ], HealthService.health);

    return (
        <Page title="Home">
            { (queryInfo.isSuccess && queryHealth.isSuccess)

                ? <div className="w-full h-full px-[5%] py-20">
                    <div className="flex flex-col gap-20">
                        <div>
                            <h1 className="text-3xl font-medium">
                                Welcome to the&nbsp;
                                <strong className="text-transparent font-bold bg-gradient-to-b bg-clip-text from-[hsl(var(--accent-1))] to-pink-500">
                                    {queryInfo.data.app.name}
                                </strong>
                                &nbsp;dashboard !
                            </h1>
                            <h2 className="text-lg">
                                {queryInfo.data.app.stage.toUpperCase()} v{queryInfo.data.app.version}
                            </h2>
                            <p className="mt-4">
                                {queryInfo.data.app.description}
                            </p>
                        </div>
                        <StatusCards data={queryHealth.data} />
                    </div>
                </div>

                : <Loader />
            }
        </Page>
    );
};
