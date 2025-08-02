export const isNullOrUndefined = (value: unknown): value is null | undefined =>
    value === null || value === undefined;

export const isNotNullOrUndefined = <V>(value: V | null | undefined): value is V =>
    !isNullOrUndefined(value);
