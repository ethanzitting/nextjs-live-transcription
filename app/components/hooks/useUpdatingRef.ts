import { useEffect, useRef } from "react";

export const useUpdatingRef = <T>(val: T) => {
  const ref = useRef<T>(val);

  useEffect(() => {
    ref.current = val;
  }, [val]);

  return ref;
};
