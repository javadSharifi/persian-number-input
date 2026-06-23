import { useRef, useLayoutEffect, useCallback } from "react";

export const useCursorManager = (
  inputRef: React.RefObject<HTMLInputElement | null>,
  trigger: number
) => {
  const cursorRef = useRef<number | null>(null);

  const setCursor = useCallback((pos: number) => {
    cursorRef.current = pos;
  }, []);

  useLayoutEffect(() => {
    if (inputRef.current && cursorRef.current !== null) {
      inputRef.current.setSelectionRange(
        cursorRef.current,
        cursorRef.current
      );
      cursorRef.current = null;
    }
  }, [trigger, inputRef]);

  return { setCursor };
};
