export interface Slice<T> {
    content: T[];
    slice: SliceInfos;
}

interface SliceInfos {
    number: number;
    size: number;
    numberOfElements: number;
    hasContent: boolean;
    first: boolean;
    last: boolean;
    next: boolean;
    previous: boolean;
}
