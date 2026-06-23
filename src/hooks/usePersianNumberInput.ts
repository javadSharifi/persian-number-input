import React, { useState, useCallback, useRef, useEffect } from "react";
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
  const { setCursor } = useCursorManager(inputRef);

  useEffect(() => {
    setRawValue(sanitizeNumericInput(initialValue, maxDecimals, decimalChar));
  }, [initialValue, maxDecimals, decimalChar]);

  const transformOpts = {
    separatorCount,
    separatorChar,
    decimalChar,
    suffix,
    locale,
    showZero,
    maxDecimals,
  };

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
          input.value = displayValue;
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
    } else if (input.value !== displayValue) {
      input.value = displayValue;
    }
  };

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === " ") {
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
    onBlur,
    rawValue,
    inputRef,
    setRawValue: updateValue,
  };
};
