export const isNullOrUndefined = <V>(value: V | null | undefined): value is null | undefined =>
    value === null || value === undefined;

export const isNotNullOrUndefined = <V>(value: V | null | undefined): value is V =>
    !isNullOrUndefined(value);
