import {
  groupDigits,
  toLocalizedDigits,
  localizeDecimalSeparator,
} from "./digitUtils";
import Decimal from "decimal.js";

export interface TransformNumberOptions {
  separatorCount?: number;
  separatorChar?: string;
  locale?: "fa" | "en" | string;
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
    maxDecimals,
    showZero = false,
  } = options || {};

  if (rawValue === null || rawValue === undefined || rawValue === "") {
    return showZero ? toLocalizedDigits("0", locale as any) : "";
  }

  if (rawValue === "-") {
    return "-";
  }
  if (rawValue === ".") {
    const display = showZero ? "0." : ".";
    const localizedDisplay = localizeDecimalSeparator(display, locale as any);
    return toLocalizedDigits(localizedDisplay, locale as any);
  }
  if (rawValue === "-.") {
    const display = showZero ? "-0." : "-.";
    const localizedDisplay = localizeDecimalSeparator(display, locale as any);
    return toLocalizedDigits(localizedDisplay, locale as any);
  }

  if (!/^-?\d*(\.\d*)?$/.test(rawValue)) {
    console.warn(`Invalid rawValue passed to transformNumber: "${rawValue}"`);
    return showZero ? toLocalizedDigits("0", locale as any) : "";
  }

  let isEffectivelyZero = false;
  try {
    if (rawValue !== "-" && rawValue !== "." && rawValue !== "-.") {
      isEffectivelyZero = new Decimal(rawValue).isZero();
    }
  } catch {}

  if (isEffectivelyZero && !showZero) {
    if (!rawValue.endsWith(".")) {
      return "";
    }
  }

  let [integerPart, fractionalPart] = rawValue.split(".");
  const hasTrailingDot = rawValue.endsWith(".") && fractionalPart === undefined;

  if (integerPart === "" || integerPart === "-") {
    integerPart = rawValue.startsWith("-") ? "-0" : "0";
  }

  const sign = integerPart.startsWith("-") ? "-" : "";
  const absIntPart = integerPart.startsWith("-")
    ? integerPart.substring(1)
    : integerPart;
  const groupedAbsInt = groupDigits(absIntPart, separatorCount, separatorChar);
  const groupedInt = sign + groupedAbsInt;

  let finalStr = groupedInt;
  if (fractionalPart !== undefined) {
    finalStr = `${groupedInt}.${fractionalPart}`;
  } else if (hasTrailingDot) {
    finalStr = `${groupedInt}.`;
  }

  if (locale && locale !== "en") {
    finalStr = localizeDecimalSeparator(finalStr, locale as any);
    finalStr = toLocalizedDigits(finalStr, locale as any);
  }

  return finalStr;
};
