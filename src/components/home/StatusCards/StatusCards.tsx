import { StatusCard } from "components/home";
import { GridLayout } from "layouts";
import type { FC } from "react";
import { FaDatabase, FaHdd, FaServer, FaWifi } from "react-icons/fa";
import type { Health } from "types/health";

type Props = {
    data: Health;
};

export const StatusCards: FC<Props> = ({ data }) => {
    return (
        <GridLayout>
            <StatusCard
                title="API"
                icon={<FaServer size={30} />}
                status={data.status}
            />
            <StatusCard
                title={"DB " + data.components.db.details.database}
                icon={<FaDatabase size={30} />}
                status={data.components.db.status}
            />
            <StatusCard
                title="Ping"
                icon={<FaWifi size={30} />}
                status={data.components.ping.status}
            />
            <StatusCard
                title={`Disk ${(data.components.diskSpace.details.free / 1_000_000_000).toFixed(1)} GB`}
                icon={<FaHdd size={30} />}
                status={data.components.diskSpace.status}
            />
        </GridLayout>
    );
};
