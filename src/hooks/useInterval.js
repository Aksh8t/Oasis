import { useEffect, useRef } from 'react';

/**
 * A custom React hook for setting a declarative interval.
 * @param {function} callback - The function to call on each interval.
 * @param {number | null} delay - The interval delay in ms, or null to pause.
 */
export const useInterval = (callback, delay) => {
    const savedCallback = useRef();
    
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};