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

        const handleOutsideClick = (e: MouseEvent) => {
            if (ref.current && ref.current === e.target as Node) {
                handleClose();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => e.key === "Escape" && handleClose();

        if (element) {
            element.focus();

            if (config.outsideClick) {
                element.addEventListener("click", handleOutsideClick);
            }
            if (config.escapeKey) {
                window.addEventListener("keydown", handleKeyDown);
            }
        }

        return () => {
            if (element) {
                if (config.outsideClick) {
                    element.removeEventListener("click", handleOutsideClick);
                }
                if (config.escapeKey) {
                    window.removeEventListener("keydown", handleKeyDown);
                }
            }
        };
    }, [ handleClose, config.outsideClick, config.escapeKey ]);

    return ref;
};
