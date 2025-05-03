"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformNumber = void 0;
// utils/transformNumber.ts
const digitUtils_1 = require("./digitUtils");
const decimal_js_1 = __importDefault(require("decimal.js")); // برای بررسی دقیق صفر
/**
 * رشته عددی خام (انگلیسی، با نقطه استاندارد) را به فرمت نمایشی تبدیل می‌کند.
 * فرض می‌شود ورودی از rawValue هوک آمده و قبلا sanitize و round شده است.
 *
 * @param rawValue رشته عددی خام (مثلا "1234.5", "15.", "-0.1", "-", ".") یا undefined.
 * @param options تنظیمات قالب بندی.
 * @returns رشته قالب بندی شده برای نمایش.
 */
const transformNumber = (rawValue, // تغییر ورودی به string | undefined برای وضوح
options) => {
    const { separatorCount = 3, separatorChar = ',', locale = 'fa', maxDecimals, // ممکن است برای نمایش لازم باشد (اگرچه round در هوک انجام شده)
    showZero = false, } = options || {};
    // 1. مدیریت ورودی‌های null/undefined/empty
    if (rawValue === null || rawValue === undefined || rawValue === "") {
        // نکته: تبدیل صفر به لوکال '۰' در صورت نیاز
        return showZero ? (0, digitUtils_1.toLocalizedDigits)("0", locale) : "";
    }
    // 2. مدیریت حالت‌های خاص که ممکن است rawValue باشند
    if (rawValue === "-") {
        // اگر فقط منفی است، و showZero فعال است، شاید بهتر باشد "-0" نمایش دهیم؟
        // فعلا خود "-" را برمی‌گردانیم یا اگر showZero=false خالی؟ سازگاری مهم است.
        // اجازه دهید نمایش "-" را بدهیم.
        return "-"; // یا بر اساس showZero تصمیم بگیرید
    }
    if (rawValue === ".") {
        // نمایش "۰٫" یا فقط "٫" ؟ نمایش "۰٫" خواناتر است.
        const display = showZero ? "0." : ".";
        const localizedDisplay = (0, digitUtils_1.localizeDecimalSeparator)(display, locale);
        return (0, digitUtils_1.toLocalizedDigits)(localizedDisplay, locale);
    }
    if (rawValue === "-.") {
        const display = showZero ? "-0." : "-.";
        const localizedDisplay = (0, digitUtils_1.localizeDecimalSeparator)(display, locale);
        return (0, digitUtils_1.toLocalizedDigits)(localizedDisplay, locale);
    }
    // 3. اطمینان از معتبر بودن فرمت (اختیاری، چون rawValue باید معتبر باشد)
    //    این regex نقطه انتهایی را هم قبول می‌کند
    if (!/^-?\d*(\.\d*)?$/.test(rawValue)) {
        console.warn(`Invalid rawValue passed to transformNumber: "${rawValue}"`);
        return showZero ? (0, digitUtils_1.toLocalizedDigits)("0", locale) : "";
    }
    // 4. بررسی صفر بودن مقدار (با دقت Decimal.js)
    let isEffectivelyZero = false;
    try {
        if (rawValue !== '-' && rawValue !== '.' && rawValue !== '-.') { // از Decimal با این مقادیر جلوگیری کن
            isEffectivelyZero = new decimal_js_1.default(rawValue).isZero();
        }
    }
    catch ( /* خطا در تبدیل به Decimal نادیده گرفته شود */_a) { /* خطا در تبدیل به Decimal نادیده گرفته شود */ }
    if (isEffectivelyZero && !showZero) {
        // اگر مقدار صفر است و نباید نمایش داده شود
        // مگر اینکه کاربر در حال تایپ نقطه بعد از صفر باشد (مثل '0.')
        if (!rawValue.endsWith('.')) {
            return "";
        }
    }
    // 5. جدا کردن قسمت صحیح و اعشاری
    //    rawValue باید از قبل round شده باشد، پس نیازی به roundToDecimals مجدد نیست.
    let [integerPart, fractionalPart] = rawValue.split('.');
    // بررسی وجود نقطه انتهایی (وقتی fractionalPart بعد از split کردن undefined است ولی نقطه در رشته بود)
    const hasTrailingDot = rawValue.endsWith('.') && fractionalPart === undefined;
    // رسیدگی به حالت‌هایی مثل ".5" که integerPart خالی است
    if (integerPart === "" || integerPart === "-") {
        // اگر فقط "-" بود یا خالی، با صفر جایگزین کن (اگر قرار است چیزی نمایش داده شود)
        integerPart = rawValue.startsWith('-') ? "-0" : "0";
    }
    // 6. گروه‌بندی ارقام قسمت صحیح
    const sign = integerPart.startsWith('-') ? '-' : '';
    const absIntPart = integerPart.startsWith('-') ? integerPart.substring(1) : integerPart;
    const groupedAbsInt = (0, digitUtils_1.groupDigits)(absIntPart, separatorCount, separatorChar);
    const groupedInt = sign + groupedAbsInt;
    // 7. بازسازی رشته نهایی (با در نظر گرفتن نقطه انتهایی)
    let finalStr = groupedInt;
    if (fractionalPart !== undefined) { // اگر قسمت اعشاری وجود دارد
        finalStr = `${groupedInt}.${fractionalPart}`;
    }
    else if (hasTrailingDot) { // ****** این قسمت اصلاح شده ******
        // اگر قسمت اعشاری وجود ندارد ولی رشته اصلی با نقطه تمام شده بود
        finalStr = `${groupedInt}.`;
    }
    // 8. محلی سازی (ارقام و جداکننده اعشار)
    if (locale && locale !== 'en') {
        // اول جداکننده نقطه را به محلی تبدیل کن
        finalStr = (0, digitUtils_1.localizeDecimalSeparator)(finalStr, locale);
        // سپس ارقام انگلیسی را به محلی تبدیل کن
        finalStr = (0, digitUtils_1.toLocalizedDigits)(finalStr, locale);
    }
    return finalStr;
};
exports.transformNumber = transformNumber;
//# sourceMappingURL=transformNumber.js.map