import { requestData } from "api/client";
import type { CurrentUser } from "types/auth/user";

const URL = "/api/me";

const findMe = () => requestData<CurrentUser>(URL);

export const MeService = {
    findMe
};
