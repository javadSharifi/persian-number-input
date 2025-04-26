// utils/transformNumber.ts
import {
  convertToEnglishDigits,
  groupDigits,
  toLocalizedDigits,
  localizeDecimalSeparator,
} from "./digitUtils";

// تعریف دقیق تر آپشن ها
export interface TransformNumberOptions {
  /** تعداد ارقام در هر گروه برای جداسازی (مثلا 3). 0 یا کمتر یعنی بدون جداسازی. */
  separatorCount?: number;
  /** کاراکتر جداکننده گروه ها (پیش فرض ','). */
  separatorChar?: string;
  /** کد زبان برای نمایش ارقام ('fa', 'en', ...). پیش فرض 'fa'. */
  locale?: 'fa' | 'en' | string; // اجازه دادن به زبان های دیگر با string
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
export const transformNumber = (
  input: number | string | null | undefined,
  options?: TransformNumberOptions
): string => {
  const {
    separatorCount = 3, // پیش فرض 3 برای هزارگان
    separatorChar = ',',
    locale = 'fa',
    maxDecimals = 0,
    showZero = false, // به طور پیش فرض صفر نمایش داده نشود مگر اینکه صریحا خواسته شود
  } = options || {};

  if (input === null || input === undefined || input === "") {
    return showZero ? toLocalizedDigits("0", locale as any) : ""; // اگر ورودی خالی است و showZero=false، خالی برگردان
  }

  // 1. تبدیل ورودی به رشته و سپس به ارقام انگلیسی و پاکسازی اولیه
  //    توجه: در استفاده با input، بهتر است sanitizeNumericInput روی مقدار input *قبل* از پاس دادن به این تابع اجرا شود.
  //    اما برای اطمینان، اینجا هم یک تبدیل اولیه انجام می دهیم.
  let str = convertToEnglishDigits(String(input));

  // 2. بررسی اولیه برای معتبر بودن فرمت عددی (اختیاری اما مفید)
  //    این regex اجازه یک منفی در ابتدا و یک نقطه اعشار را می دهد.
  if (!/^-?\d*(\.\d*)?$/.test(str)) {
     // اگر فرمت پایه عددی نیست (بعد از تبدیل به انگلیسی)، یا خالی برگردان یا خود ورودی اصلی
     // تصمیم: فعلا خالی بر میگردانیم یا صفر اگر showZero فعال باشد
     console.warn(`Invalid numeric string after conversion: "${str}" from input: "${input}"`);
     return showZero ? toLocalizedDigits("0", locale as any) : "";
  }

  // تبدیل رشته خالی یا فقط "-" به صفر اگر showZero فعال باشد
  if ((str === "" || str === "-") && showZero) {
      str = "0";
  } else if (str === "" || str === "-") {
      return ""; // اگر ورودی فقط "-" بود یا خالی شد، خالی برگردان
  }

  // اگر ورودی فقط "." بود
  if (str === ".") {
     return showZero ? toLocalizedDigits("0", locale as any) : "۰" ; // یا شاید "۰." ؟ تصمیم با شماست. نمایش صفر منطقی تر است.
  }


  // 3. محدود کردن تعداد ارقام اعشار
  let [integerPart, fractionalPart] = str.split('.');
  integerPart = integerPart || "0"; // اگر ورودی مثل ".5" بود

  if (fractionalPart !== undefined) {
    if (maxDecimals > 0) {
      fractionalPart = fractionalPart.slice(0, maxDecimals);
      // اگر بعد از بریدن، قسمت اعشاری خالی شد، آن را حذف کن
      str = fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
    } else {
      // اگر maxDecimals صفر است، قسمت اعشار را حذف کن
      str = integerPart;
    }
  } else {
    str = integerPart; // قسمت اعشاری وجود نداشت
  }


  // 4. جداسازی ارقام قسمت صحیح
  //    دوباره استخراج بخش صحیح و اعشاری چون ممکن است در مرحله 3 تغییر کرده باشد
  [integerPart, fractionalPart] = str.split('.');
  integerPart = integerPart || "0"; // اطمینان مجدد برای حالت "."

  const groupedInt = groupDigits(integerPart, separatorCount, separatorChar);

  // 5. ترکیب مجدد قسمت صحیح و اعشاری (اگر وجود دارد)
  let finalStr = fractionalPart !== undefined ? `${groupedInt}.${fractionalPart}` : groupedInt;

  // 6. محلی سازی (اگر locale انگلیسی نیست)
  if (locale && locale !== 'en') {
      // 6.1 جایگزینی جداکننده اعشار انگلیسی با محلی (قبل از تبدیل ارقام)
      finalStr = localizeDecimalSeparator(finalStr, locale);
      // 6.2 تبدیل ارقام انگلیسی به محلی
      finalStr = toLocalizedDigits(finalStr, locale as any); // cast لازم است چون locale ممکن است string باشد
  }

  return finalStr;
};