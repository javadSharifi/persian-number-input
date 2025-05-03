export interface TransformNumberOptions {
    separatorCount?: number;
    separatorChar?: string;
    locale?: 'fa' | 'en' | string;
    maxDecimals?: number;
    showZero?: boolean;
}
/**
 * رشته عددی خام (انگلیسی، با نقطه استاندارد) را به فرمت نمایشی تبدیل می‌کند.
 * فرض می‌شود ورودی از rawValue هوک آمده و قبلا sanitize و round شده است.
 *
 * @param rawValue رشته عددی خام (مثلا "1234.5", "15.", "-0.1", "-", ".") یا undefined.
 * @param options تنظیمات قالب بندی.
 * @returns رشته قالب بندی شده برای نمایش.
 */
export declare const transformNumber: (rawValue: string | undefined, // تغییر ورودی به string | undefined برای وضوح
options?: TransformNumberOptions) => string;
//# sourceMappingURL=transformNumber.d.ts.map