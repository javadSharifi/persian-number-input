import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  transformNumber,
  TransformNumberOptions,
} from "../utils/transformNumber";
import { sanitizeNumericInput } from "../utils/digitUtils";
import { useCursorManager } from "./useCursorManager";

interface UsePersianNumberInputProps
  extends Omit<TransformNumberOptions, "maxDecimals"> {
  initialValue?: number | string;
  onValueChange?: (value: string | undefined) => void;
  min?: number;
  max?: number;
  maxDecimals?: number;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const ALLOWED_KEY_PATTERN = /^[0-9.\-]$/;
const PERSIAN_ARABIC_DIGIT_RE = /^[\u0660-\u0669\u06F0-\u06F9]$/;

function isAllowedKey(e: React.KeyboardEvent<HTMLInputElement>): boolean {
  if (e.ctrlKey || e.metaKey || e.altKey) return true;
  const { key } = e;
  if (key === "Backspace" || key === "Delete" || key === "Tab") return true;
  if (key.startsWith("Arrow") || key === "Home" || key === "End") return true;
  if (key === "Enter") return true;
  if (ALLOWED_KEY_PATTERN.test(key)) return true;
  if (PERSIAN_ARABIC_DIGIT_RE.test(key)) return true;
  return false;
}

export const usePersianNumberInput = (
  props: UsePersianNumberInputProps = {}
) => {
  const {
    initialValue,
    separatorCount = 3,
    separatorChar = ",",
    decimalChar,
    suffix,
    locale = "fa",
    showZero = false,
    onValueChange,
    min,
    max,
    maxDecimals,
    onBlur: externalOnBlur,
  } = props;

  const [rawValue, setRawValue] = useState<string | undefined>(() =>
    sanitizeNumericInput(initialValue, maxDecimals, decimalChar)
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const rawValueLen = rawValue ? rawValue.length : 0;
  const { setCursor } = useCursorManager(inputRef, rawValueLen);

  const transformOpts = useMemo(
    () => ({
      separatorCount,
      separatorChar,
      decimalChar,
      suffix,
      locale,
      showZero,
      maxDecimals,
    }),
    [
      separatorCount,
      separatorChar,
      decimalChar,
      suffix,
      locale,
      showZero,
      maxDecimals,
    ]
  );

  const displayValue = transformNumber(rawValue, transformOpts);

  const updateValue = useCallback(
    (nextRaw: string) => {
      if (nextRaw !== "" && nextRaw !== ".") {
        const num = parseFloat(nextRaw);
        if (max !== undefined && !isNaN(num) && num > max) return;
      }
      setRawValue(nextRaw);
      onValueChange?.(nextRaw);
    },
    [max, onValueChange]
  );

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const value = input.value;
    const sanitized = sanitizeNumericInput(value, maxDecimals, decimalChar);

    if (sanitized !== rawValue) {
      if (sanitized !== "" && sanitized !== ".") {
        const num = parseFloat(sanitized);
        if (max !== undefined && !isNaN(num) && num > max) {
          return;
        }
      }

      const prevFormatted = transformNumber(rawValue, transformOpts);
      const nextFormatted = transformNumber(sanitized, transformOpts);

      let cursor = input.selectionStart || 0;
      const diff = nextFormatted.length - prevFormatted.length;
      setCursor(cursor + diff);

      setRawValue(sanitized);
      onValueChange?.(sanitized);
    }
  };

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isAllowedKey(e)) {
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
    },
    [suffix, rawValue, updateValue]
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text");
      const sanitized = sanitizeNumericInput(pasted, maxDecimals, decimalChar);
      updateValue(sanitized);
    },
    [maxDecimals, decimalChar, updateValue]
  );

  const onBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (rawValue && rawValue !== ".") {
        const num = parseFloat(rawValue);
        if (min !== undefined && !isNaN(num) && num < min) {
          const minStr = String(min);
          setRawValue(minStr);
          onValueChange?.(minStr);
        }
      }
      externalOnBlur?.(event);
    },
    [rawValue, min, onValueChange, externalOnBlur]
  );

  return {
    value: displayValue,
    onChange,
    onKeyDown,
    onPaste,
    onBlur,
    rawValue,
    inputRef,
    setRawValue: updateValue,
  };
};
