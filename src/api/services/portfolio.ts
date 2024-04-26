import { request } from "api/client";

const URL = "portfolio";

const revalidate = () => request(`/${URL}/revalidate`, { method: "POST" });

export const PortfolioService = {
    revalidate
};
