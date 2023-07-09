export type User = {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    roles: Role[];
};

export type Role = {
    id: number;
    name: string;
};

export type Project = {
    id: number;
    title: string;
    description: string;
    creationDate: string;
    repoUrl: string;
    demoUrl: string;
    skills: Skill[];
    image: Image;
    featured: boolean;
};

export type Skill = {
    id: number;
    name: string;
    sort: number;
    image: Image;
};

export type Image = {
    id: number;
    uuid?: string;
    alt: string;
};

export type Page<E> = {
    content: E[];
    pageable: {
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        pageSize: number;
        pageNumber: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
};
