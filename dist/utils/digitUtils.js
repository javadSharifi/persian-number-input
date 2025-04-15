export const digitsMap = {
    fa: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
    in: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
};
// تبدیل اعداد به اعداد محلی با استفاده از نقشه
export const toLocalizedDigits = (numStr, locale) => {
    const digits = digitsMap[locale];
    return numStr.replace(/\d/g, (digit) => digits[parseInt(digit)]);
};
// گروه‌بندی اعداد با استفاده از جداکننده
export const groupDigits = (numStr, separatorCount, separatorChar = ",") => {
    if (separatorCount && separatorCount > 0) {
        return numStr.replace(new RegExp(`\\B(?=(\\d{${separatorCount}})+(?!\\d))`, "g"), separatorChar);
    }
    return numStr;
};
// تبدیل اعداد محلی به اعداد انگلیسی
export const convertToEnglishDigits = (str) => {
    const map = {
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
        "०": "0",
        "१": "1",
        "२": "2",
        "३": "3",
        "४": "4",
        "५": "5",
        "६": "6",
        "७": "7",
        "८": "8",
        "९": "9",
    };
    return str.replace(/[۰-۹०-९]/g, (char) => map[char]);
};
//# sourceMappingURL=digitUtils.js.map