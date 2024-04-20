import type { ReactNode } from "react";
import type { Falsy } from "types/utils/union";

export type RenderableReactNode = Exclude<ReactNode, Falsy>;
