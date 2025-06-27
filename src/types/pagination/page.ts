export interface Page<T> {
    content: T[];
    page: PageInfos;
}

interface PageInfos {
    number: number;
    size: number;
    numberOfElements: number;
    hasContent: boolean;
    first: boolean;
    last: boolean;
    next: boolean;
    previous: boolean;
    totalPages: number;
    totalElements: number;
}
