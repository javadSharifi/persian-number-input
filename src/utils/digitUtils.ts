const LOCAL_DIGITS_MAP: Record<string, string> = {
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
  "٫": ".",
  "/": ".",
};

export const digitsMap: Record<string, string[]> = {
  fa: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
  ar: ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"],
};

export const decimalSeparatorMap: Record<string, string> = {
  fa: "٫",
  ar: "٫",
};

export const toEnglishDigits = (str: string, decimalChar?: string): string => {
  let result = str.replace(
    /[۰-۹٠-٩٫\/]/g,
    (match) => LOCAL_DIGITS_MAP[match] || match
  );

  if (decimalChar && decimalChar !== "." && result.includes(decimalChar)) {
    result = result.split(decimalChar).join(".");
  }

  return result;
};

export const convertToEnglishDigits = toEnglishDigits;

export const toLocalizedDigits = (numStr: string, locale: string): string => {
  const targetLocale = digitsMap[locale] ? locale : "fa";
  const localeDigits = digitsMap[targetLocale];
  return numStr.replace(/\d/g, (digit) => localeDigits[parseInt(digit, 10)]);
};

export const localizeDecimalSeparator = (
  numStr: string,
  locale: string,
  customDecimalChar?: string
): string => {
  if (!numStr.includes(".")) return numStr;
  const separator = customDecimalChar || decimalSeparatorMap[locale] || "٫";
  return numStr.replace(".", separator);
};

export const groupDigits = (
  numStr: string,
  separatorCount: number,
  separatorChar = ","
): string => {
  if (!numStr || separatorCount <= 0) return numStr;
  const regex = new RegExp(`\\B(?=(\\d{${separatorCount}})+(?!\\d))`, "g");
  return numStr.replace(regex, separatorChar);
};

export const sanitizeNumericInput = (
  value: string | number | null | undefined,
  maxDecimals?: number,
  decimalChar?: string
): string => {
  if (value === null || value === undefined) return "";
  let str = toEnglishDigits(String(value), decimalChar);

  str = str.replace(/[^0-9.]/g, "");

  const parts = str.split(".");
  if (parts.length > 2) {
    str = parts[0] + "." + parts.slice(1).join("");
  }

  str = str.replace(/^0+(?!$|\.)/, "");

  if (str.includes(".")) {
    const [intPart, fracPart] = str.split(".");
    if (maxDecimals !== undefined) {
      const truncatedFrac =
        maxDecimals > 0 ? fracPart.slice(0, maxDecimals) : "";
      str = truncatedFrac ? `${intPart}.${truncatedFrac}` : intPart;
      if (maxDecimals > 0 && String(value).endsWith(decimalChar || ".")) {
        str = str.includes(".") ? str : `${str}.`;
      }
    }
  }

  return str;
};

export const roundToDecimals = (
  value: string,
  maxDecimals?: number
): string => {
  if (maxDecimals === undefined || !value || !value.includes(".")) return value;
  const [int, frac] = value.split(".");
  return maxDecimals > 0 ? `${int}.${frac.slice(0, maxDecimals)}` : int;
};
