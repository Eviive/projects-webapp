import type { Ref } from "react";
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

export type PropsWithStatus<Props = unknown> = Props & EmptyProps & LoadingProps & ErrorProps;

export type PropsWithForwardedRef<Props, RefContent> = Props & { ref: Ref<RefContent> };
