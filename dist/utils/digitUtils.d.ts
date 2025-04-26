/**
 * نقشه ارقام محلی برای زبان‌های مختلف.
 */
export declare const digitsMap: {
    [key: string]: ReadonlyArray<string>;
};
/**
 * نقشه جداکننده اعشار برای زبان‌های مختلف.
 */
export declare const decimalSeparatorMap: {
    [key: string]: string;
};
/**
 * تبدیل رشته حاوی ارقام محلی (مانند فارسی) به رشته با ارقام انگلیسی (0-9).
 * @param str رشته ورودی
 * @returns رشته با ارقام انگلیسی
 */
export declare const convertToEnglishDigits: (str: string) => string;
/**
 * تبدیل رشته حاوی ارقام انگلیسی (0-9) به رشته با ارقام محلی.
 * @param numStr رشته با ارقام انگلیسی
 * @param locale کد زبان ('fa', 'in', ...)
 * @returns رشته با ارقام محلی
 */
export declare const toLocalizedDigits: (numStr: string, locale: keyof typeof digitsMap) => string;
/**
 * جایگزینی جداکننده اعشار انگلیسی (.) با جداکننده محلی.
 * @param numStr رشته با ارقام و جداکننده انگلیسی
 * @param locale کد زبان
 * @returns رشته با جداکننده اعشار محلی
 */
export declare const localizeDecimalSeparator: (numStr: string, locale: keyof typeof decimalSeparatorMap) => string;
/**
 * گروه‌بندی ارقام قسمت صحیح یک عدد با استفاده از جداکننده.
 * @param numStr قسمت صحیح عدد (فقط ارقام انگلیسی)
 * @param separatorCount تعداد ارقام در هر گروه
 * @param separatorChar کاراکتر جداکننده
 * @returns رشته گروه‌بندی شده
 */
export declare const groupDigits: (numStr: string, separatorCount: number, separatorChar?: string) => string;
/**
 * پاک‌سازی ورودی عددی برای اجازه دادن به کاراکترهای مجاز (اعداد، نقطه و منفی).
 * این نسخه جدید: ارقام فارسی و جداکننده اعشار فارسی را هم پشتیبانی می‌کند.
 * @param value - رشته ورودی
 * @returns رشته پاک‌شده
 */
export declare const sanitizeNumericInput: (value: string) => string;
//# sourceMappingURL=digitUtils.d.ts.map