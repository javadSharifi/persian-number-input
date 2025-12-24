import React, { forwardRef, useImperativeHandle } from "react";
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

const PersianNumberInput = forwardRef<
  HTMLInputElement,
  PersianNumberInputProps
>((props, ref) => {
  const {
    initialValue,
    separatorCount,
    separatorChar,
    decimalChar,
    locale,
    showZero,
    onValueChange,
    min,
    max,
    maxDecimals,
    onBlur: propsOnBlur,
    ...rest
  } = props;

  const { value, onChange, onBlur, inputRef } = usePersianNumberInput({
    initialValue,
    separatorCount,
    separatorChar,
    decimalChar,
    locale,
    showZero,
    onValueChange,
    min,
    max,
    maxDecimals,
    onBlur: propsOnBlur,
  });

  useImperativeHandle(ref, () => inputRef.current!);

  return (
    <input
      {...rest}
      ref={inputRef}
      type="text"
      inputMode="decimal"
      dir="ltr"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
});

PersianNumberInput.displayName = "PersianNumberInput";

export default PersianNumberInput;
