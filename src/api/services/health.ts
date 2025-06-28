import { request } from "api/client";
import type { Info } from "types/health";

const URL = "actuator";

const info = () => request<Info>(`/${URL}/info`);

export const HealthService = {
    info
};
