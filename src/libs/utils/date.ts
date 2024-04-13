export const toLocalDate = (date: Date): Date => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};
