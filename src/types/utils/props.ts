import type { RenderableReactNode } from "types/utils/react";

type FalseOrNode = false | RenderableReactNode;

export type EmptyProps = {
    empty: FalseOrNode;
};

export type LoadingProps = {
    loading: FalseOrNode;
};

export type ErrorProps = {
    error: FalseOrNode;
};

export type PropsWithStatus<P = unknown> = P & EmptyProps & LoadingProps & ErrorProps;
