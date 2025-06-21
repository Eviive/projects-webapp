import { StatusCard } from "components/home/status-card";
import { Grid } from "layouts/grid";
import type { FC } from "react";
import { FaDatabase, FaHdd, FaServer, FaWifi } from "react-icons/fa";
import type { Health } from "types/health";

interface Props {
    data: Health;
}

export const StatusCards: FC<Props> = ({ data }) => {
    return (
        <Grid columnCount={4}>
            <StatusCard title="API" icon={<FaServer size={35} />} status={data.status} />
            <StatusCard
                title={
                    data.components.db.details
                        ? "DB " + data.components.db.details.database
                        : "Database"
                }
                icon={<FaDatabase size={35} />}
                status={data.components.db.status}
            />
            <StatusCard
                title="Ping"
                icon={<FaWifi size={35} />}
                status={data.components.ping.status}
            />
            <StatusCard
                title={
                    data.components.diskSpace.details
                        ? `Disk ${(data.components.diskSpace.details.free / 1_000_000_000).toFixed(1)} GB`
                        : "Disk"
                }
                icon={<FaHdd size={35} />}
                status={data.components.diskSpace.status}
            />
        </Grid>
    );
};
