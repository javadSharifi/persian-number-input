import React from "react";
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
  inputDecimalSeparator?: string;
}

const PersianNumberInput: React.FC<PersianNumberInputProps> = ({
  initialValue,
  separatorCount,
  separatorChar,
  locale,
  showZero,
  onValueChange,
  min,
  max,
  maxDecimals,
  inputDecimalSeparator,
  ...restInputProps
}) => {
  if (maxDecimals !== undefined && maxDecimals < 0) {
    console.warn("maxDecimals باید غیرمنفی باشد");
    maxDecimals = 0;
  }
  if (min !== undefined && max !== undefined && min > max) {
    console.warn("min نباید بزرگ‌تر از max باشد");
  }

  const { value: formattedValue, onChange } = usePersianNumberInput({
    initialValue,
    separatorCount,
    separatorChar,
    locale,
    showZero,
    onValueChange,
    min,
    max,
    maxDecimals,
    inputDecimalSeparator, 
  });

  return (
    <input
      type="text" 
      inputMode="decimal" 
      dir="ltr" 
      {...restInputProps} 
      value={formattedValue} 
      onChange={onChange} 
    />
  );
};

export default PersianNumberInput;