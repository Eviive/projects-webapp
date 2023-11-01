import { useCallback, useState } from "react";

type Dimensions = {
    width: number;
    height: number;
};

export const useDimensions = <E extends HTMLElement = HTMLElement>() => {

    const [ dimensions, setDimensions ] = useState<Dimensions | null>(null);

    const ref = useCallback((node: E) => {
        if (node === null) return;

        const boundingRect = node.getBoundingClientRect();
        setDimensions(prevDimensions => {
            if (prevDimensions?.width === boundingRect.width && prevDimensions?.height === boundingRect.height) {
                return prevDimensions;
            }

            return {
                width: boundingRect.width,
                height: boundingRect.height
            };
        });
    }, []);

    return {
        ref,
        dimensions
    };
};
