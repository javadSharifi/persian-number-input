"use strict";
// utils/digitUtils.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeNumericInput = exports.groupDigits = exports.localizeDecimalSeparator = exports.toLocalizedDigits = exports.convertToEnglishDigits = exports.decimalSeparatorMap = exports.digitsMap = void 0;
/**
 * نقشه ارقام محلی برای زبان‌های مختلف.
 */
exports.digitsMap = {
    fa: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
    // می‌توانید زبان‌های دیگر را اضافه کنید
    // in: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
};
/**
 * نقشه جداکننده اعشار برای زبان‌های مختلف.
 */
exports.decimalSeparatorMap = {
    fa: "٫",
    // en: ".",
};
// همه ارقام محلی را به یک رشته واحد می‌چسبانیم تا regex بسازیم
const allLocalizedDigits = Object.values(exports.digitsMap).flat().join("");
// مپ برای تبدیل رقم محلی به رقم انگلیسی
const conversionMap = {};
for (const locale in exports.digitsMap) {
    exports.digitsMap[locale].forEach((digit, index) => {
        conversionMap[digit] = index.toString();
    });
}
// Regex برای پیدا کردن تمام ارقام محلی
const localizedDigitsRegex = new RegExp(`[${allLocalizedDigits}]`, 'g');
/**
 * تبدیل رشته حاوی ارقام محلی (مانند فارسی) به رشته با ارقام انگلیسی (0-9).
 * @param str رشته ورودی
 * @returns رشته با ارقام انگلیسی
 */
const convertToEnglishDigits = (str) => {
    if (!str)
        return "";
    return str.replace(localizedDigitsRegex, (char) => conversionMap[char] || char);
};
exports.convertToEnglishDigits = convertToEnglishDigits;
/**
 * تبدیل رشته حاوی ارقام انگلیسی (0-9) به رشته با ارقام محلی.
 * @param numStr رشته با ارقام انگلیسی
 * @param locale کد زبان ('fa', 'in', ...)
 * @returns رشته با ارقام محلی
 */
const toLocalizedDigits = (numStr, locale) => {
    if (!numStr || !exports.digitsMap[locale])
        return numStr;
    const localeDigits = exports.digitsMap[locale];
    return numStr.replace(/\d/g, (digit) => localeDigits[parseInt(digit, 10)]);
};
exports.toLocalizedDigits = toLocalizedDigits;
/**
 * جایگزینی جداکننده اعشار انگلیسی (.) با جداکننده محلی.
 * @param numStr رشته با ارقام و جداکننده انگلیسی
 * @param locale کد زبان
 * @returns رشته با جداکننده اعشار محلی
 */
const localizeDecimalSeparator = (numStr, locale) => {
    const separator = exports.decimalSeparatorMap[locale];
    if (!separator)
        return numStr;
    return numStr.replace('.', separator);
};
exports.localizeDecimalSeparator = localizeDecimalSeparator;
/**
 * گروه‌بندی ارقام قسمت صحیح یک عدد با استفاده از جداکننده.
 * @param numStr قسمت صحیح عدد (فقط ارقام انگلیسی)
 * @param separatorCount تعداد ارقام در هر گروه
 * @param separatorChar کاراکتر جداکننده
 * @returns رشته گروه‌بندی شده
 */
const groupDigits = (numStr, separatorCount, separatorChar = ',') => {
    if (!numStr || separatorCount <= 0) {
        return numStr;
    }
    const regex = new RegExp(`\\B(?=(\\d{${separatorCount}})+(?!\\d))`, 'g');
    return numStr.replace(regex, separatorChar);
};
exports.groupDigits = groupDigits;
/**
 * پاک‌سازی ورودی عددی برای اجازه دادن به کاراکترهای مجاز (اعداد، نقطه و منفی).
 * این نسخه جدید: ارقام فارسی و جداکننده اعشار فارسی را هم پشتیبانی می‌کند.
 * @param value - رشته ورودی
 * @returns رشته پاک‌شده
 */
const sanitizeNumericInput = (value) => {
    // ۱) تبدیل ارقام فارسی به انگلیسی
    let normalized = (0, exports.convertToEnglishDigits)(value);
    // ۲) تبدیل جداکننده اعشار فارسی (٫) به نقطه
    normalized = normalized.replace(/٫/g, '.');
    // ۳) حذف کاراکترهای غیرمجاز
    let sanitized = normalized.replace(/[^0-9.\-]/g, '');
    // حذف صفرهای ابتدایی مگر در موارد اعشاری
    if (sanitized.startsWith('0') && !sanitized.startsWith('0.') && sanitized.length > 1) {
        sanitized = sanitized.replace(/^0+/, '');
    }
    // نگه‌داشتن فقط یک نقطه اعشار
    const parts = sanitized.split('.');
    if (parts.length > 2) {
        sanitized = `${parts[0]}.${parts[1]}`;
    }
    // حذف منفی‌های اضافه و اطمینان از جای صحیح آن
    sanitized = sanitized.replace(/-+/g, '-');
    if (sanitized.includes('-') && !sanitized.startsWith('-')) {
        sanitized = sanitized.replace(/-/, '');
    }
    // اگر ورودی خالی یا فقط '-' یا '.' است، خالی برگردان
    if (sanitized === '' || sanitized === '-' || sanitized === '.') {
        return '';
    }
    return sanitized;
};
exports.sanitizeNumericInput = sanitizeNumericInput;
//# sourceMappingURL=digitUtils.js.map