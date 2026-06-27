import React, { useCallback } from "react";
import { KeyFilter } from "../utils/keyFilter";
import { sanitizeNumericInput } from "../utils/digitUtils";

interface EventOptions {
  keyFilter: KeyFilter;
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

      externalOnKeyDown?.(e);
    },
    [keyFilter, updateValue, externalOnKeyDown]
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
