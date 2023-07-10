import { Falsy } from "types/app";

export const formatClassNames = (...classNames: (string | Falsy)[]) => classNames.filter(Boolean).join(" ");
