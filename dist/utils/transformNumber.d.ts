export interface TransformNumberOptions {
    /** تعداد ارقام در هر گروه برای جداسازی (مثلا 3). 0 یا کمتر یعنی بدون جداسازی. */
    separatorCount?: number;
    /** کاراکتر جداکننده گروه ها (پیش فرض ','). */
    separatorChar?: string;
    /** کد زبان برای نمایش ارقام ('fa', 'en', ...). پیش فرض 'fa'. */
    locale?: 'fa' | 'en' | string;
    /** حداکثر تعداد ارقام اعشار مجاز. 0 یعنی بدون اعشار. */
    maxDecimals?: number;
    /** اگر true باشد، حتی اگر مقدار ورودی 0 باشد، آن را نمایش بده. پیش فرض false */
    showZero?: boolean;
}
/**
 * یک عدد یا رشته عددی را به فرمت محلی و گروه بندی شده تبدیل می کند.
 *
 * @param input عدد یا رشته ورودی. می تواند شامل ارقام محلی یا انگلیسی باشد.
 * @param options تنظیمات قالب بندی.
 * @returns رشته قالب بندی شده یا رشته خالی اگر ورودی نامعتبر یا صفر (و showZero=false) باشد.
 */
export declare const transformNumber: (input: number | string | null | undefined, options?: TransformNumberOptions) => string;
//# sourceMappingURL=transformNumber.d.ts.map