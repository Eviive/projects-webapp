import { requestData } from "api/client";
import type { CurrentUser } from "types/auth";

const URL = "/api/me";

const me = () => requestData<CurrentUser>(URL);

export const MeService = {
    me
};
