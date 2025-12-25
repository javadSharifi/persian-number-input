import {
  groupDigits,
  toLocalizedDigits,
  localizeDecimalSeparator,
} from "./digitUtils";

export interface TransformNumberOptions {
  separatorCount?: number;
  separatorChar?: string;
  decimalChar?: string;
  suffix?: string;
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
    decimalChar,
    suffix,
    locale = "fa",
    showZero = false,
  } = options || {};

  if (rawValue === null || rawValue === undefined || rawValue === "") {
    const zeroVal = showZero ? toLocalizedDigits("0", locale) : "";
    if (zeroVal && suffix) return `${zeroVal} ${suffix}`;
    return zeroVal;
  }

  let [integerPart, fractionalPart] = rawValue.split(".");
  const hasTrailingDot = rawValue.endsWith(".");

  const absIntPart =
    integerPart || (hasTrailingDot || fractionalPart !== undefined ? "0" : "");

  if (absIntPart === "" && !hasTrailingDot && fractionalPart === undefined) {
    const zeroVal = showZero ? toLocalizedDigits("0", locale) : "";
    if (zeroVal && suffix) return `${zeroVal} ${suffix}`;
    return zeroVal;
  }

  const groupedInt = groupDigits(absIntPart, separatorCount, separatorChar);

  let finalStr = groupedInt;
  if (fractionalPart !== undefined) {
    finalStr = `${groupedInt}.${fractionalPart}`;
  } else if (hasTrailingDot) {
    finalStr = `${groupedInt}.`;
  }

  if (decimalChar || locale !== "en") {
    finalStr = localizeDecimalSeparator(finalStr, locale, decimalChar);
  }

  if (locale !== "en") {
    finalStr = toLocalizedDigits(finalStr, locale);
  }

  if (suffix) {
    finalStr = `${finalStr} ${suffix}`;
  }

  return finalStr;
};
