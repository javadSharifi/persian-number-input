import React, { forwardRef, useMemo } from "react";
import {
  usePersianNumberInput,
  type UsePersianNumberInputProps,
} from "../hooks/usePersianNumberInput";
import type { TransformNumberOptions } from "../utils/transformNumber";

interface PersianNumberInputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "value" | "min" | "max"
    >,
    Omit<TransformNumberOptions, "maxDecimals"> {
  initialValue?: number | string;
  onValueChange?: (value: string | undefined) => void;
  min?: number;
  max?: number;
  maxDecimals?: number;
}

function mergeRefs<T>(
  ...refs: (React.Ref<T> | null | undefined)[]
): React.RefCallback<T> {
  return (value: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref && typeof ref === "object") {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    }
  };
}

const PersianNumberInput = forwardRef<
  HTMLInputElement,
  PersianNumberInputProps
>((props, ref) => {
  const {
    initialValue,
    separatorCount,
    separatorChar,
    decimalChar,
    suffix,
    locale,
    showZero,
    onValueChange,
    min,
    max,
    maxDecimals,
    onChange: externalOnChange,
    onBlur: externalOnBlur,
    onKeyDown: externalOnKeyDown,
    onPaste: externalOnPaste,
    ...rest
  } = props;

  const hookProps: UsePersianNumberInputProps = {
    initialValue,
    separatorCount,
    separatorChar,
    decimalChar,
    suffix,
    locale,
    showZero,
    onValueChange,
    min,
    max,
    maxDecimals,
    onChange: externalOnChange,
    onBlur: externalOnBlur,
    onKeyDown: externalOnKeyDown,
    onPaste: externalOnPaste,
  };

  const { value, onChange, onKeyDown, onPaste, onBlur, inputRef, isInvalid } =
    usePersianNumberInput(hookProps);

  const mergedRef = useMemo(() => mergeRefs(ref, inputRef), [ref, inputRef]);

  return (
    <input
      ref={mergedRef}
      type="text"
      inputMode="decimal"
      dir="ltr"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      onBlur={onBlur}
      aria-invalid={isInvalid || undefined}
      {...rest}
    />
  );
});

PersianNumberInput.displayName = "PersianNumberInput";

export default PersianNumberInput;
