import { useRef, useState, useLayoutEffect, useCallback } from "react";

export const useCursorManager = (
  inputRef: React.RefObject<HTMLInputElement | null>
) => {
  const cursorRef = useRef<number | null>(null);
  const [tick, setTick] = useState(0);

  const setCursor = useCallback((pos: number) => {
    cursorRef.current = pos;
    setTick((t) => t + 1);
  }, []);

  useLayoutEffect(() => {
    if (inputRef.current && cursorRef.current !== null) {
      inputRef.current.setSelectionRange(
        cursorRef.current,
        cursorRef.current
      );
      cursorRef.current = null;
    }
  }, [tick, inputRef]);

  return { setCursor };
};
