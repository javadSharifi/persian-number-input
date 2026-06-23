import React, { forwardRef, useCallback, useMemo } from "react";
import { usePersianNumberInput } from "../hooks/usePersianNumberInput";
import type { TransformNumberOptions } from "../utils/transformNumber";

interface PersianNumberInputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "onChange" | "value" | "min" | "max"
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
    onBlur: propsOnBlur,
    onKeyDown: propsOnKeyDown,
    onPaste: propsOnPaste,
    ...rest
  } = props;

  const { value, onChange, onKeyDown, onPaste, onBlur, inputRef } =
    usePersianNumberInput({
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
      onBlur: propsOnBlur,
    });

  const mergedRef = useMemo(() => mergeRefs(ref, inputRef), [ref, inputRef]);

  const composedOnKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown(e);
      propsOnKeyDown?.(e);
    },
    [onKeyDown, propsOnKeyDown]
  );

  const composedOnPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      onPaste(e);
      propsOnPaste?.(e);
    },
    [onPaste, propsOnPaste]
  );

  return (
    <input
      {...rest}
      ref={mergedRef}
      type="text"
      inputMode="decimal"
      dir="ltr"
      value={value}
      onChange={onChange}
      onKeyDown={composedOnKeyDown}
      onPaste={composedOnPaste}
      onBlur={onBlur}
    />
  );
});

PersianNumberInput.displayName = "PersianNumberInput";

export default PersianNumberInput;
