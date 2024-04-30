import { request } from "api/client";

const URL = "portfolio";

const revalidate = () =>
    request(`/${URL}/revalidate`, {
        method: "POST",
        requiredAuthorities: ["revalidate:portfolio"]
    });

export const PortfolioService = {
    revalidate
};
