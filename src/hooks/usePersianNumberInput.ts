import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  transformNumber,
  TransformNumberOptions,
} from "../utils/transformNumber";
import { sanitizeNumericInput, toEnglishDigits } from "../utils/digitUtils";
import { createNumericKeyFilter } from "../utils/keyFilter";
import { useCursorManager } from "./useCursorManager";
import { useNumberFormatter } from "./useNumberFormatter";
import { useNumberValidation } from "./useNumberValidation";
import { useNumericInputEvents } from "./useNumericInputEvents";

// Same number written differently ("12." vs "12", "0.50" vs ".5", "-" vs "") → same key
const numericKey = (raw: string): string => {
  const neg = raw.startsWith("-");
  const [int = "", frac = ""] = raw.replace("-", "").split(".");
  const i = int.replace(/^0+/, "");
  const f = frac.replace(/0+$/, "");
  if (!i && !f) return /\d/.test(raw) ? "0" : "";
  return `${neg ? "-" : ""}${i || "0"}${f ? `.${f}` : ""}`;
};

export interface UsePersianNumberInputProps
  extends Omit<TransformNumberOptions, "maxDecimals"> {
  initialValue?: number | string;
  /** Controlled value. When it changes (e.g. a form reset) the input shows it. */
  value?: number | string | null;
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
    value,
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
    sanitizeNumericInput(
      value !== undefined ? value : initialValue,
      maxDecimals,
      decimalChar
    )
  );
  const [prevValue, setPrevValue] = useState(value);

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

  // Controlled value changed from outside: show it, unless it is just the number the user
  // is already typing (parent may echo "12." back as 12 — that must not eat the dot)
  if (value !== prevValue) {
    setPrevValue(value);
    const next = sanitizeNumericInput(value, maxDecimals, decimalChar);
    if (numericKey(next) !== numericKey(rawValue ?? "")) {
      setRawValue(next);
      setIsInvalid(!validateOnChange(next));
    }
  }

  // raw caret index → caret index in the formatted text (separators are skipped)
  const toFormattedCaret = (rawCaret: number, nextRaw: string) => {
    const formatted = transformNumber(nextRaw, transformOpts);
    let count = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (count >= rawCaret) return i;
      if (formatted[i] !== separatorChar) count++;
    }
    return formatted.length;
  };

  const updateValue = useCallback(
    (nextRaw: string, rawCaret?: number) => {
      if (rawCaret !== undefined) {
        cursorTrigger.current += 1;
        setCursor(toFormattedCaret(rawCaret, nextRaw));
      }
      const valid = validateOnChange(nextRaw);
      setIsInvalid(!valid);
      setRawValue(nextRaw);
      if (valid) {
        onValueChange?.(nextRaw);
      }
    },
    [validateOnChange, onValueChange, transformOpts, separatorChar, setCursor]
  );

  const keyFilter = useMemo(
    () => createNumericKeyFilter(decimalChar ? [{ key: decimalChar }] : []),
    [decimalChar]
  );

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
    const raw = rawValue ?? "";
    const caret = input.selectionStart ?? value.length;
    // separators are display-only: drop them first so "." can be a separator when decimalChar is ","
    const toRaw = (s: string) =>
      toEnglishDigits(s.split(separatorChar).join(""), decimalChar);
    const typed = toRaw(value);
    let sanitized = sanitizeNumericInput(typed, maxDecimals);
    // raw caret = numeric chars the user left before the caret in the edited text
    let rawCursor = toRaw(value.slice(0, caret)).replace(/[^0-9.-]/g, "").length;

    // Reject edits that would silently drop digits: a second decimal point, or a
    // digit beyond maxDecimals (bulk input into an empty field is still truncated)
    const fraction = typed.split(".")[1]?.replace(/\D/g, "") ?? "";
    if (
      typed.split(".").length > 2 ||
      (raw !== "" && maxDecimals !== undefined && fraction.length > maxDecimals)
    ) {
      sanitized = raw;
    }

    // Backspace/Delete removed only a separator: delete the neighbouring digit instead
    const inputType = (event.nativeEvent as InputEvent | undefined)?.inputType;
    const back = inputType === "deleteContentBackward" && rawCursor > 0;
    if (sanitized === raw && value !== displayValue && (back || inputType === "deleteContentForward")) {
      if (back) rawCursor -= 1;
      sanitized = sanitizeNumericInput(
        raw.slice(0, rawCursor) + raw.slice(rawCursor + 1),
        maxDecimals
      );
    }

    if (sanitized !== raw) {
      const valid = validateOnChange(sanitized);
      setIsInvalid(!valid);

      cursorTrigger.current += 1;
      setCursor(toFormattedCaret(rawCursor, sanitized));

      setRawValue(sanitized);
      if (valid) {
        onValueChange?.(sanitized);
      }
    } else if (value !== displayValue) {
      // Rejected edit: React restores the old text after this handler and the caret
      // jumps to the end, so put it back where it was once React is done
      const pos = Math.min(
        Math.max(caret - (value.length - displayValue.length), 0),
        displayValue.length
      );
      queueMicrotask(() => input.setSelectionRange?.(pos, pos));
    }

    externalOnChange?.(event);
  };

  const onBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      // drop unfinished input ("-", ".", "12.") so consumers never keep a non-number
      const cleaned = (rawValue ?? "").replace(/\.$/, "").replace(/^-$/, "");
      const result = validateOnBlur(cleaned);
      const final = result.correctedValue ?? cleaned;
      if (final !== (rawValue ?? "")) {
        setRawValue(final);
        onValueChange?.(final);
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
    setRawValue: (value: string) =>
      updateValue(sanitizeNumericInput(value, maxDecimals, decimalChar)),
    isInvalid,
  };
};
