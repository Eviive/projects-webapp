import { useEffect, useState } from "react";

const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

interface UseCountUpOutput {
    count: number;
    start: () => void;
}

export const useCountUp = (endValue: number | null, duration = 1000): UseCountUpOutput => {
    const [count, setCount] = useState(0);

    const [targetValue, setTargetValue] = useState(endValue);

    const [start, setStart] = useState(false);

    const [startTimestamp, setStartTimestamp] = useState<number | null>(null);

    useEffect(() => {
        if (endValue !== targetValue) {
            setTargetValue(endValue);
            setStartTimestamp(null);
        }
    }, [endValue, targetValue]);

    useEffect(() => {
        if (!start || targetValue === null) return;

        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (startTimestamp === null) {
                setStartTimestamp(timestamp);
                return;
            }

            const elapsed = timestamp - startTimestamp;
            const progress = easeOutQuad(Math.min(elapsed / duration, 1));
            setCount(count + Math.floor((targetValue - count) * progress));

            if (elapsed < duration) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [start, targetValue, duration, startTimestamp, count]);

    return {
        count,
        start: () => {
            if (!start) {
                setStart(true);
            }
        }
    };
};
