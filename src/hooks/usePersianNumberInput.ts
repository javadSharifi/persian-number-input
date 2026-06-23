import React, { useState, useCallback, useRef } from "react";
import {
  transformNumber,
  TransformNumberOptions,
} from "../utils/transformNumber";
import { sanitizeNumericInput } from "../utils/digitUtils";
import { createNumericKeyFilter } from "../utils/keyFilter";
import { useCursorManager } from "./useCursorManager";
import { useNumberFormatter } from "./useNumberFormatter";
import { useNumberValidation } from "./useNumberValidation";
import { useNumericInputEvents } from "./useNumericInputEvents";

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
  const rawValueLen = rawValue ? rawValue.length : 0;
  const { setCursor } = useCursorManager(inputRef, rawValueLen);

  const { displayValue, transformOpts } = useNumberFormatter(rawValue ?? "", {
    separatorCount,
    separatorChar,
    decimalChar,
    suffix,
    locale,
    showZero,
    maxDecimals,
  });

  const { validateOnChange, validateOnBlur } = useNumberValidation({
    min,
    max,
  });

  const updateValue = useCallback(
    (nextRaw: string) => {
      if (!validateOnChange(nextRaw)) return;
      setRawValue(nextRaw);
      onValueChange?.(nextRaw);
    },
    [validateOnChange, onValueChange]
  );

  const keyFilter = createNumericKeyFilter();

  const { onKeyDown, onPaste } = useNumericInputEvents({
    keyFilter,
    suffix,
    rawValue: rawValue ?? "",
    maxDecimals,
    decimalChar,
    updateValue,
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const value = input.value;
    const sanitized = sanitizeNumericInput(value, maxDecimals, decimalChar);

    if (sanitized !== rawValue) {
      if (!validateOnChange(sanitized)) return;

      const prevFormatted = transformNumber(rawValue, transformOpts);
      const nextFormatted = transformNumber(sanitized, transformOpts);

      let cursor = input.selectionStart || 0;
      const diff = nextFormatted.length - prevFormatted.length;
      setCursor(cursor + diff);

      setRawValue(sanitized);
      onValueChange?.(sanitized);
    }
  };

  const onBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const result = validateOnBlur(rawValue ?? "");
      if (!result.valid && result.correctedValue !== undefined) {
        setRawValue(result.correctedValue);
        onValueChange?.(result.correctedValue);
      }
      externalOnBlur?.(event);
    },
    [rawValue, validateOnBlur, onValueChange, externalOnBlur]
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
