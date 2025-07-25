export const isTokenExpired = (exp: number) => {
    return Date.now() >= (exp - 10) * 1000;
};
