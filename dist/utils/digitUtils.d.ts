/**
 * نقشه ارقام محلی برای زبان‌های مختلف.
 */
export declare const digitsMap: {
    [key: string]: ReadonlyArray<string>;
};
/**
 * نقشه جداکننده اعشار برای زبان‌های مختلف (برای نمایش خروجی).
 */
export declare const decimalSeparatorMap: {
    [key: string]: string;
};
export declare const convertToEnglishDigits: (str: string) => string;
export declare const toLocalizedDigits: (numStr: string, locale: keyof typeof digitsMap) => string;
export declare const localizeDecimalSeparator: (numStr: string, locale: keyof typeof decimalSeparatorMap) => string;
export declare const groupDigits: (numStr: string, separatorCount: number, separatorChar?: string) => string;
/**
 * پاک‌سازی ورودی عددی.
 * ارقام محلی و جداکننده اعشار محلی (٫) و جداکننده دلخواه ورودی را به انگلیسی تبدیل می‌کند.
 * کاراکترهای غیرمجاز را حذف می‌کند.
 * فقط یک نقطه اعشار و یک علامت منفی در ابتدا را مجاز می‌داند.
 *
 * @param value رشته ورودی
 * @param inputDecimalSeparator کاراکتر جداکننده اعشار که کاربر در ورودی استفاده می‌کند (پیش‌فرض '.')
 * @returns رشته پاک‌شده با ارقام انگلیسی و نقطه استاندارد (.). می‌تواند شامل '-' یا '.' یا '-.' باشد.
 */
export declare const sanitizeNumericInput: (value: string | number | null | undefined, inputDecimalSeparator?: string) => string;
/**
 * گرد کردن یا محدود کردن تعداد ارقام اعشار یک رشته عددی (انگلیسی).
 * مهم: این تابع نقطه انتهایی را حفظ می‌کند اگر ورودی با نقطه تمام شود و maxDecimals صفر نباشد.
 * @param value رشته عددی با ارقام انگلیسی و نقطه استاندارد.
 * @param maxDecimals حداکثر تعداد اعشار مجاز (undefined یعنی بدون محدودیت).
 * @returns رشته گرد شده یا محدود شده.
 */
export declare const roundToDecimals: (value: string, maxDecimals?: number) => string;
//# sourceMappingURL=digitUtils.d.ts.map