type DebouncedFunction<T extends unknown[]> = (...args: T) => void;

export const debounce = <T extends unknown[]>(
    fn: DebouncedFunction<T>,
    delay: number
): DebouncedFunction<T> => {
    let timer: number | null = null;

    return (...args: T) => {
        if (timer !== null) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};
