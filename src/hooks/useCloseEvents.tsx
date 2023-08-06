import { useEffect, useRef } from "react";

export type ModalConfig = {
	outsideClick?: boolean;
	escapeKey?: boolean;
};

export const useCloseEvents = <E extends HTMLElement>(handleClose: () => void, config: ModalConfig = { outsideClick: true, escapeKey: true }) => {

    const ref = useRef<E | null>(null);

    config = {
        ...config,
        outsideClick: config.outsideClick ?? true,
        escapeKey: config.escapeKey ?? true
    };

    useEffect(() => {
        const element = ref.current;
        const controller = new AbortController();

        const handleOutsideClick = (e: MouseEvent) => {
            if (ref.current && ref.current === e.target as Node) {
                handleClose();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => e.key === "Escape" && handleClose();

        if (element) {
            element.focus();

            config.outsideClick && element.addEventListener("click", handleOutsideClick, { signal: controller.signal });
            config.escapeKey && window.addEventListener("keydown", handleKeyDown, { signal: controller.signal });
        }

        return () => controller.abort();
    }, [ handleClose, config.outsideClick, config.escapeKey ]);

    return ref;
};
