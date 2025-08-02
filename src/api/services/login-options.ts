import { requestData } from "api/client";
import type { LoginOption } from "types/auth/login-options";

const URL = "/api/login/options";

const findLoginOptions = () => requestData<LoginOption[]>(URL);

export const LoginOptionsService = {
    findLoginOptions
};
