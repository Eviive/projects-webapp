import type { RenderableReactNode } from "types/utils/react";

export type EmptyProps = {
    empty: false | RenderableReactNode;
};

export type LoadingProps = {
    loading: false | RenderableReactNode;
};

export type ErrorProps = {
    error: false | RenderableReactNode;
};

export type PropsWithStatus<P = unknown> = P & EmptyProps & LoadingProps & ErrorProps;
