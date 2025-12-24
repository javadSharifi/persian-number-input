"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundToDecimals = exports.sanitizeNumericInput = exports.groupDigits = exports.localizeDecimalSeparator = exports.toLocalizedDigits = exports.convertToEnglishDigits = exports.toEnglishDigits = exports.decimalSeparatorMap = exports.digitsMap = void 0;
const LOCAL_DIGITS_MAP = {
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
exports.digitsMap = {
    fa: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
    ar: ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"],
};
exports.decimalSeparatorMap = {
    fa: "٫",
    ar: "٫",
};
const toEnglishDigits = (str, decimalChar) => {
    let result = str.replace(/[۰-۹٠-٩٫\/]/g, (match) => LOCAL_DIGITS_MAP[match] || match);
    if (decimalChar && decimalChar !== "." && result.includes(decimalChar)) {
        result = result.split(decimalChar).join(".");
    }
    return result;
};
exports.toEnglishDigits = toEnglishDigits;
exports.convertToEnglishDigits = exports.toEnglishDigits;
const toLocalizedDigits = (numStr, locale) => {
    const targetLocale = exports.digitsMap[locale] ? locale : "fa";
    const localeDigits = exports.digitsMap[targetLocale];
    return numStr.replace(/\d/g, (digit) => localeDigits[parseInt(digit, 10)]);
};
exports.toLocalizedDigits = toLocalizedDigits;
const localizeDecimalSeparator = (numStr, locale, customDecimalChar) => {
    if (!numStr.includes("."))
        return numStr;
    const separator = customDecimalChar || exports.decimalSeparatorMap[locale] || "٫";
    return numStr.replace(".", separator);
};
exports.localizeDecimalSeparator = localizeDecimalSeparator;
const groupDigits = (numStr, separatorCount, separatorChar = ",") => {
    if (!numStr || separatorCount <= 0)
        return numStr;
    const regex = new RegExp(`\\B(?=(\\d{${separatorCount}})+(?!\\d))`, "g");
    return numStr.replace(regex, separatorChar);
};
exports.groupDigits = groupDigits;
const sanitizeNumericInput = (value, maxDecimals, decimalChar) => {
    if (value === null || value === undefined)
        return "";
    let str = (0, exports.toEnglishDigits)(String(value), decimalChar);
    str = str.replace(/[^0-9.]/g, "");
    const parts = str.split(".");
    if (parts.length > 2) {
        str = parts[0] + "." + parts.slice(1).join("");
    }
    str = str.replace(/^0+(?!$|\.)/, "");
    if (str.includes(".")) {
        const [intPart, fracPart] = str.split(".");
        if (maxDecimals !== undefined) {
            const truncatedFrac = maxDecimals > 0 ? fracPart.slice(0, maxDecimals) : "";
            str = truncatedFrac ? `${intPart}.${truncatedFrac}` : intPart;
            if (maxDecimals > 0 && String(value).endsWith(decimalChar || ".")) {
                str = str.includes(".") ? str : `${str}.`;
            }
        }
    }
    return str;
};
exports.sanitizeNumericInput = sanitizeNumericInput;
const roundToDecimals = (value, maxDecimals) => {
    if (maxDecimals === undefined || !value || !value.includes("."))
        return value;
    const [int, frac] = value.split(".");
    return maxDecimals > 0 ? `${int}.${frac.slice(0, maxDecimals)}` : int;
};
exports.roundToDecimals = roundToDecimals;
//# sourceMappingURL=digitUtils.js.map