import { useMemo } from "react";
import {
  transformNumber,
  TransformNumberOptions,
} from "../utils/transformNumber";

type FormatterOptions = Omit<TransformNumberOptions, "maxDecimals"> & {
  maxDecimals?: number;
};

export const useNumberFormatter = (
  rawValue: string | undefined,
  options: FormatterOptions
) => {
  const {
    separatorCount = 3,
    separatorChar = ",",
    decimalChar,
    suffix,
    locale = "fa",
    showZero = false,
    maxDecimals,
  } = options;

  const transformOpts = useMemo(
    () => ({
      separatorCount,
      separatorChar,
      decimalChar,
      suffix,
      locale,
      showZero,
      maxDecimals,
    }),
    [
      separatorCount,
      separatorChar,
      decimalChar,
      suffix,
      locale,
      showZero,
      maxDecimals,
    ]
  );

  const displayValue = transformNumber(rawValue, transformOpts);

  return { displayValue, transformOpts };
};
