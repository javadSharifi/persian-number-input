import React, { useState, useCallback, useRef, useLayoutEffect } from "react";
import Decimal from "decimal.js";
import {
  transformNumber,
  TransformNumberOptions,
} from "../utils/transformNumber";
import { sanitizeNumericInput } from "../utils/digitUtils";

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
  const selectionRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (inputRef.current && selectionRef.current !== null) {
      inputRef.current.setSelectionRange(
        selectionRef.current,
        selectionRef.current
      );
    }
  });

  const updateValue = useCallback(
    (nextRaw: string) => {
      if (nextRaw !== "" && nextRaw !== ".") {
        try {
          const num = new Decimal(nextRaw);
          if (max !== undefined && num.gt(max)) return;
        } catch {
          return;
        }
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

    const prevFormatted = transformNumber(rawValue, {
      separatorCount,
      separatorChar,
      decimalChar,
      locale,
      showZero,
    });
    const nextFormatted = transformNumber(sanitized, {
      separatorCount,
      separatorChar,
      decimalChar,
      locale,
      showZero,
    });

    let cursor = input.selectionStart || 0;
    const diff = nextFormatted.length - prevFormatted.length;
    selectionRef.current = cursor + diff;

    updateValue(sanitized);
  };

  const onBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (rawValue && rawValue !== ".") {
        try {
          const num = new Decimal(rawValue);
          if (min !== undefined && num.lt(min)) {
            const minStr = String(min);
            setRawValue(minStr);
            onValueChange?.(minStr);
          }
        } catch {}
      }
      externalOnBlur?.(event);
    },
    [rawValue, min, onValueChange, externalOnBlur]
  );

  const displayValue = transformNumber(rawValue, {
    separatorCount,
    separatorChar,
    decimalChar,
    locale,
    showZero,
    maxDecimals,
  });

  return {
    value: displayValue,
    onChange,
    onBlur,
    rawValue,
    inputRef,
    setRawValue: updateValue,
  };
};
