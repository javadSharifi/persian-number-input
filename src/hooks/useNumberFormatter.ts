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
    locale = "fa",
    showZero = false,
    maxDecimals,
  } = options;

  const transformOpts = useMemo(
    () => ({
      separatorCount,
      separatorChar,
      decimalChar,
      locale,
      showZero,
      maxDecimals,
    }),
    [
      separatorCount,
      separatorChar,
      decimalChar,
      locale,
      showZero,
      maxDecimals,
    ]
  );

  const displayValue = transformNumber(rawValue, transformOpts);

  return { displayValue, transformOpts };
};
