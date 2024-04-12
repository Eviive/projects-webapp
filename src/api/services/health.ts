import { request } from "api/client";
import type { Health, HttpExchange, Info } from "types/health";

const URL = "actuator";

const health = () => request<Health>(`/${URL}/health`);

const httpExchanges = async (): Promise<HttpExchange[]> => {
    const data = await request<{ exchanges: HttpExchange[] }>(`/${URL}/httpexchanges`);

    return data.exchanges.map(exchange => ({
        ...exchange,
        uuid: crypto.randomUUID()
    }));
};

const info = () => request<Info>(`/${URL}/info`);

export const HealthService = {
    health,
    httpExchanges,
    info
};
