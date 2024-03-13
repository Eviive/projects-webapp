export type DndItem = {
    id: number;
    sort: number;
};

export type DndState = {
    isDndActive: boolean;
    isDndTouched: boolean;
    isDndSubmitting: boolean;
};

export type DndSaveItem = {
    id: number;
    sort: number;
};
