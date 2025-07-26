import { requestData } from "api/client";
import type { Info } from "types/health";

const URL = "/api/info";

const findApiInfo = () => requestData<Info>(URL);

export const InfoService = {
    findApiInfo
};
