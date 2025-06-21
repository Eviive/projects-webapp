import type { RenderableReactNode } from "types/utils/react";

type FalseOrNode = false | RenderableReactNode;

export interface EmptyProps {
    empty: FalseOrNode;
}

export interface LoadingProps {
    loading: FalseOrNode;
}

export interface ErrorProps {
    error: FalseOrNode;
}

export type PropsWithStatus<P = unknown> = P & EmptyProps & LoadingProps & ErrorProps;
