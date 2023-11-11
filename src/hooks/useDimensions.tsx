import { useCallback, useState } from "react";

type Dimensions = {
    width: number;
    height: number;
};

type UseDimensionsOutput<E extends HTMLElement> = {
    ref: (node: E) => void;
    dimensions: Dimensions;
};

export const useDimensions = <E extends HTMLElement = HTMLElement>(): UseDimensionsOutput<E> => {

    const [ dimensions, setDimensions ] = useState<Dimensions>({
        width: 0,
        height: 0
    });

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
