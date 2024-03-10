import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type UseCountUpOutput = {
    count: number;
    setStart: Dispatch<SetStateAction<boolean>>;
};

export const useCountUp = (endValue: number, duration: number = 1000): UseCountUpOutput => {

    const [ count, setCount ] = useState(0);

    const [ start, setStart ] = useState(false);

    useEffect(() => {
        if (!start) return;

        let startTimestamp: number;
        const animate = (timestamp: number) => {
            if (startTimestamp === undefined) {
                startTimestamp = timestamp;
            }

            const elapsed = timestamp - startTimestamp;
            const progress = easeOutCubic(Math.min(elapsed / duration, 1));
            setCount(Math.floor(endValue * progress));

            if (elapsed < duration) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [ start, endValue, duration ]);

    return {
        count,
        setStart
    };
};
