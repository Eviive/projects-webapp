import { requestData } from "api/client";

const URL = "/api/portfolio";

const revalidate = () =>
    requestData(`${URL}/revalidate`, {
        method: "POST",
        requiredAuthorities: ["revalidate:portfolio"]
    });

export const PortfolioService = {
    revalidate
};
