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

  const inputRef = useRef<HTMLInputElement>(null);
  const cursorTrigger = useRef(0);
  const { setCursor } = useCursorManager(inputRef, cursorTrigger.current);

  const { displayValue, transformOpts } = useNumberFormatter(rawValue ?? "", {
    separatorCount,
    separatorChar,
    decimalChar,
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
    rawValue: rawValue ?? "",
    maxDecimals,
    decimalChar,
    separatorChar,
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

      cursorTrigger.current += 1;
      const formattedCursor = input.selectionStart ?? 0;
      let rawCursor = 0;
      for (let i = 0; i < formattedCursor && i < prevFormatted.length; i++) {
        if (prevFormatted[i] !== separatorChar) rawCursor++;
      }
      let newFormattedCursor = nextFormatted.length;
      let rawCount = 0;
      for (let i = 0; i < nextFormatted.length; i++) {
        if (rawCount >= rawCursor) { newFormattedCursor = i; break; }
        if (nextFormatted[i] !== separatorChar) rawCount++;
      }
      setCursor(newFormattedCursor);

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
