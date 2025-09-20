import { useEffect } from "react";

export const useOnMount = (callback: Function) => {
    useEffect(() => {
        callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

