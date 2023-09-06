import type { UniqueIdentifier } from "@dnd-kit/core";

export type DndItem = {
    id: UniqueIdentifier;
    sort: number;
};

export type DndState = {
    isDndActive: boolean;
    isDndTouched: boolean;
    isDndSubmitting: boolean;
};
