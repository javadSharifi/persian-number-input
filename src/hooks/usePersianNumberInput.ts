import React, { useState, useCallback, useRef, useEffect } from "react";
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

export interface UsePersianNumberInputProps
  extends Omit<TransformNumberOptions, "maxDecimals"> {
  initialValue?: number | string;
  onValueChange?: (value: string | undefined) => void;
  min?: number;
  max?: number;
  maxDecimals?: number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onPaste?: React.ClipboardEventHandler<HTMLInputElement>;
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
    onChange: externalOnChange,
    onBlur: externalOnBlur,
    onKeyDown: externalOnKeyDown,
    onPaste: externalOnPaste,
  } = props;

  const [rawValue, setRawValue] = useState<string | undefined>(() =>
    sanitizeNumericInput(initialValue, maxDecimals, decimalChar)
  );

  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    setRawValue(sanitizeNumericInput(initialValue, maxDecimals, decimalChar));
    setIsInvalid(false);
  }, [initialValue, maxDecimals, decimalChar]);

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
      const valid = validateOnChange(nextRaw);
      setIsInvalid(!valid);
      setRawValue(nextRaw);
      if (valid) {
        onValueChange?.(nextRaw);
      }
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
    onKeyDown: externalOnKeyDown,
    onPaste: externalOnPaste,
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const value = input.value;
    const sanitized = sanitizeNumericInput(value, maxDecimals, decimalChar);

    if (sanitized !== rawValue) {
      const valid = validateOnChange(sanitized);
      setIsInvalid(!valid);

      const prevFormatted = transformNumber(rawValue, transformOpts);
      const nextFormatted = transformNumber(sanitized, transformOpts);

      let cursor = input.selectionStart || 0;
      const diff = nextFormatted.length - prevFormatted.length;
      setCursor(cursor + diff);

      setRawValue(sanitized);
      if (valid) {
        onValueChange?.(sanitized);
      }
    }

    externalOnChange?.(event);
  };

  const onBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const result = validateOnBlur(rawValue ?? "");
      if (!result.valid && result.correctedValue !== undefined) {
        setRawValue(result.correctedValue);
        onValueChange?.(result.correctedValue);
      }
      setIsInvalid(false);
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
    isInvalid,
  };
};
