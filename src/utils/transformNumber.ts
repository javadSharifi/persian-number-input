import {
  groupDigits,
  toLocalizedDigits,
  localizeDecimalSeparator,
} from "./digitUtils";

export interface TransformNumberOptions {
  separatorCount?: number;
  separatorChar?: string;
  locale?: "fa" | "en" | "ar" | string;
  maxDecimals?: number;
  showZero?: boolean;
}

export const transformNumber = (
  rawValue: string | undefined,
  options?: TransformNumberOptions
): string => {
  const {
    separatorCount = 3,
    separatorChar = ",",
    locale = "fa",
    showZero = false,
  } = options || {};

  if (rawValue === null || rawValue === undefined || rawValue === "") {
    return showZero ? toLocalizedDigits("0", locale) : "";
  }

  let [integerPart, fractionalPart] = rawValue.split(".");
  const hasTrailingDot = rawValue.endsWith(".");

  const absIntPart =
    integerPart || (hasTrailingDot || fractionalPart !== undefined ? "0" : "");

  if (absIntPart === "" && !hasTrailingDot && fractionalPart === undefined) {
    return showZero ? toLocalizedDigits("0", locale) : "";
  }

  const groupedInt = groupDigits(absIntPart, separatorCount, separatorChar);

  let finalStr = groupedInt;
  if (fractionalPart !== undefined) {
    finalStr = `${groupedInt}.${fractionalPart}`;
  } else if (hasTrailingDot) {
    finalStr = `${groupedInt}.`;
  }

  if (locale !== "en") {
    finalStr = localizeDecimalSeparator(finalStr, locale);
    finalStr = toLocalizedDigits(finalStr, locale);
  }

  return finalStr;
};
