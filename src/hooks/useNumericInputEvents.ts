import React, { useCallback } from "react";
import { KeyFilter } from "../utils/keyFilter";
import { sanitizeNumericInput } from "../utils/digitUtils";

interface EventOptions {
  keyFilter: KeyFilter;
  suffix?: string;
  rawValue: string;
  maxDecimals?: number;
  decimalChar?: string;
  updateValue: (value: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onPaste?: React.ClipboardEventHandler<HTMLInputElement>;
}

export const useNumericInputEvents = (options: EventOptions) => {
  const {
    keyFilter,
    suffix,
    rawValue,
    maxDecimals,
    decimalChar,
    updateValue,
    onKeyDown: externalOnKeyDown,
    onPaste: externalOnPaste,
  } = options;

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        !keyFilter({
          key: e.key,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          altKey: e.altKey,
        })
      ) {
        e.preventDefault();
      }

      if (e.key === "Backspace" && suffix && rawValue) {
        const currentValue = (e.target as HTMLInputElement).value;
        const suffixTextStart = currentValue.length - suffix.length;
        const cursorPos =
          (e.target as HTMLInputElement).selectionStart || 0;

        if (cursorPos > suffixTextStart) {
          e.preventDefault();
          const newRaw = rawValue.slice(0, -1);
          updateValue(newRaw);
        }
      }

      externalOnKeyDown?.(e);
    },
    [keyFilter, suffix, rawValue, updateValue, externalOnKeyDown]
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text");
      const sanitized = sanitizeNumericInput(pasted, maxDecimals, decimalChar);
      updateValue(sanitized);

      externalOnPaste?.(e);
    },
    [maxDecimals, decimalChar, updateValue, externalOnPaste]
  );

  return { onKeyDown, onPaste };
};
