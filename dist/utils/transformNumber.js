"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformNumber = void 0;
// utils/transformNumber.ts
const digitUtils_1 = require("./digitUtils");
/**
 * یک عدد یا رشته عددی را به فرمت محلی و گروه بندی شده تبدیل می کند.
 *
 * @param input عدد یا رشته ورودی. می تواند شامل ارقام محلی یا انگلیسی باشد.
 * @param options تنظیمات قالب بندی.
 * @returns رشته قالب بندی شده یا رشته خالی اگر ورودی نامعتبر یا صفر (و showZero=false) باشد.
 */
const transformNumber = (input, options) => {
    const { separatorCount = 3, // پیش فرض 3 برای هزارگان
    separatorChar = ',', locale = 'fa', maxDecimals = 0, showZero = false, // به طور پیش فرض صفر نمایش داده نشود مگر اینکه صریحا خواسته شود
     } = options || {};
    if (input === null || input === undefined || input === "") {
        return showZero ? (0, digitUtils_1.toLocalizedDigits)("0", locale) : ""; // اگر ورودی خالی است و showZero=false، خالی برگردان
    }
    // 1. تبدیل ورودی به رشته و سپس به ارقام انگلیسی و پاکسازی اولیه
    //    توجه: در استفاده با input، بهتر است sanitizeNumericInput روی مقدار input *قبل* از پاس دادن به این تابع اجرا شود.
    //    اما برای اطمینان، اینجا هم یک تبدیل اولیه انجام می دهیم.
    let str = (0, digitUtils_1.convertToEnglishDigits)(String(input));
    // 2. بررسی اولیه برای معتبر بودن فرمت عددی (اختیاری اما مفید)
    //    این regex اجازه یک منفی در ابتدا و یک نقطه اعشار را می دهد.
    if (!/^-?\d*(\.\d*)?$/.test(str)) {
        // اگر فرمت پایه عددی نیست (بعد از تبدیل به انگلیسی)، یا خالی برگردان یا خود ورودی اصلی
        // تصمیم: فعلا خالی بر میگردانیم یا صفر اگر showZero فعال باشد
        console.warn(`Invalid numeric string after conversion: "${str}" from input: "${input}"`);
        return showZero ? (0, digitUtils_1.toLocalizedDigits)("0", locale) : "";
    }
    // تبدیل رشته خالی یا فقط "-" به صفر اگر showZero فعال باشد
    if ((str === "" || str === "-") && showZero) {
        str = "0";
    }
    else if (str === "" || str === "-") {
        return ""; // اگر ورودی فقط "-" بود یا خالی شد، خالی برگردان
    }
    // اگر ورودی فقط "." بود
    if (str === ".") {
        return showZero ? (0, digitUtils_1.toLocalizedDigits)("0", locale) : "۰"; // یا شاید "۰." ؟ تصمیم با شماست. نمایش صفر منطقی تر است.
    }
    // 3. محدود کردن تعداد ارقام اعشار
    let [integerPart, fractionalPart] = str.split('.');
    integerPart = integerPart || "0"; // اگر ورودی مثل ".5" بود
    if (fractionalPart !== undefined) {
        if (maxDecimals > 0) {
            fractionalPart = fractionalPart.slice(0, maxDecimals);
            // اگر بعد از بریدن، قسمت اعشاری خالی شد، آن را حذف کن
            str = fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
        }
        else {
            // اگر maxDecimals صفر است، قسمت اعشار را حذف کن
            str = integerPart;
        }
    }
    else {
        str = integerPart; // قسمت اعشاری وجود نداشت
    }
    // 4. جداسازی ارقام قسمت صحیح
    //    دوباره استخراج بخش صحیح و اعشاری چون ممکن است در مرحله 3 تغییر کرده باشد
    [integerPart, fractionalPart] = str.split('.');
    integerPart = integerPart || "0"; // اطمینان مجدد برای حالت "."
    const groupedInt = (0, digitUtils_1.groupDigits)(integerPart, separatorCount, separatorChar);
    // 5. ترکیب مجدد قسمت صحیح و اعشاری (اگر وجود دارد)
    let finalStr = fractionalPart !== undefined ? `${groupedInt}.${fractionalPart}` : groupedInt;
    // 6. محلی سازی (اگر locale انگلیسی نیست)
    if (locale && locale !== 'en') {
        // 6.1 جایگزینی جداکننده اعشار انگلیسی با محلی (قبل از تبدیل ارقام)
        finalStr = (0, digitUtils_1.localizeDecimalSeparator)(finalStr, locale);
        // 6.2 تبدیل ارقام انگلیسی به محلی
        finalStr = (0, digitUtils_1.toLocalizedDigits)(finalStr, locale); // cast لازم است چون locale ممکن است string باشد
    }
    return finalStr;
};
exports.transformNumber = transformNumber;
//# sourceMappingURL=transformNumber.js.map