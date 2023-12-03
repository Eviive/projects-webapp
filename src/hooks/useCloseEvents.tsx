import { useEffect, useRef } from "react";

export type ModalConfig = {
	outsideClick?: boolean;
	escapeKey?: boolean;
    focusOut?: boolean;
};

const defaultConfig: ModalConfig = {
    outsideClick: true,
    escapeKey: true,
    focusOut: true
};

export const useCloseEvents = <E extends HTMLElement = HTMLElement>(handleClose: () => void, config: ModalConfig = defaultConfig) => {

    const ref = useRef<E | null>(null);

    config.outsideClick ??= true;
    config.escapeKey ??= true;
    config.focusOut ??= true;

    useEffect(() => {
        const element = ref.current;

        if (!element) return;

        element.focus();

        const handleOutsideClick = (e: MouseEvent) => {
            if (!element?.contains(e.target as Node)) {
                handleClose();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => e.key === "Escape" && handleClose();

        const handleFocusOut = (e: FocusEvent) => {
            if (!element?.contains(e.relatedTarget as Node)) {
                handleClose();
            }
        };

        const controller = new AbortController();

        config.outsideClick && window.addEventListener("mousedown", handleOutsideClick, { signal: controller.signal });
        config.escapeKey && window.addEventListener("keydown", handleKeyDown, { signal: controller.signal });
        config.focusOut && window.addEventListener("focusout", handleFocusOut, { signal: controller.signal });

        return () => {
            controller.abort();
        };
    }, [ handleClose, config.outsideClick, config.escapeKey, config.focusOut ]);

    return ref;
};
