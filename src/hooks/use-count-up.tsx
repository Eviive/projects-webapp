import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

type UseCountUpOutput = {
    count: number;
    setStart: Dispatch<SetStateAction<boolean>>;
};

export const useCountUp = (endValue: number, duration: number = 1000): UseCountUpOutput => {
    const [count, setCount] = useState(0);

    const [start, setStart] = useState(false);

    useEffect(() => {
        if (!start) return;

        let startTimestamp: number;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (startTimestamp === undefined) {
                startTimestamp = timestamp;
            }

            const elapsed = timestamp - startTimestamp;
            const progress = easeOutQuad(Math.min(elapsed / duration, 1));
            setCount(Math.floor(endValue * progress));

            if (elapsed < duration) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [start, endValue, duration]);

    return {
        count,
        setStart
    };
};
