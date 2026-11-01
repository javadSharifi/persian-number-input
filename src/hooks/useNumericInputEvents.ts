import React, { useCallback } from "react";
import { KeyFilter } from "../utils/keyFilter";
import { sanitizeNumericInput } from "../utils/digitUtils";

interface EventOptions {
  keyFilter: KeyFilter;
  rawValue: string;
  maxDecimals?: number;
  decimalChar?: string;
  separatorChar: string;
  updateValue: (value: string, rawCaret?: number) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onPaste?: React.ClipboardEventHandler<HTMLInputElement>;
}

export const useNumericInputEvents = (options: EventOptions) => {
  const {
    keyFilter,
    rawValue,
    maxDecimals,
    decimalChar,
    separatorChar,
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
          currentValue: e.currentTarget.value,
          selectionStart: e.currentTarget.selectionStart ?? 0,
        })
      ) {
        e.preventDefault();
      }

      externalOnKeyDown?.(e);
    },
    [keyFilter, externalOnKeyDown]
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const input = e.currentTarget;
      const selStart = input.selectionStart ?? 0;
      const selEnd = input.selectionEnd ?? 0;
      const pasted = e.clipboardData.getData("text");

      const currentFormatted = input.value;
      let rawStart = 0;
      for (let i = 0; i < selStart && i < currentFormatted.length; i++) {
        if (currentFormatted[i] !== separatorChar) rawStart++;
      }
      let rawEnd = rawStart;
      for (let i = selStart; i < selEnd && i < currentFormatted.length; i++) {
        if (currentFormatted[i] !== separatorChar) rawEnd++;
      }

      const sanitizedPaste = sanitizeNumericInput(
        pasted.split(separatorChar).join(""),
        maxDecimals,
        decimalChar
      );
      const newRaw = rawValue.slice(0, rawStart) + sanitizedPaste + rawValue.slice(rawEnd);
      // ignore pastes with no number in them, or that would add a second decimal point
      if (sanitizedPaste && newRaw.split(".").length <= 2) {
        updateValue(
          sanitizeNumericInput(newRaw, maxDecimals),
          rawStart + sanitizedPaste.length
        );
      }

      externalOnPaste?.(e);
    },
    [rawValue, maxDecimals, decimalChar, updateValue, externalOnPaste, separatorChar]
  );

  return { onKeyDown, onPaste };
};
