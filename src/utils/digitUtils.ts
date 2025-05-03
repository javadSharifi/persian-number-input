// utils/digitUtils.ts

/**
 * نقشه ارقام محلی برای زبان‌های مختلف.
 */
export const digitsMap: { [key: string]: ReadonlyArray<string> } = {
  fa: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
  // می‌توانید زبان‌های دیگر را اضافه کنید
  // ar: ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"],
};

/**
 * نقشه جداکننده اعشار برای زبان‌های مختلف (برای نمایش خروجی).
 */
export const decimalSeparatorMap: { [key: string]: string } = {
  fa: "٫",
  // en: ".", // انگلیسی معمولا نقطه است
};

// --- توابع کمکی برای تبدیل ارقام ---
const allLocalizedDigits = Object.values(digitsMap).flat().join("");
const conversionMap: { [key: string]: string } = {};
for (const locale in digitsMap) {
  digitsMap[locale].forEach((digit, index) => {
    conversionMap[digit] = index.toString();
  });
}
const localizedDigitsRegex = new RegExp(`[${allLocalizedDigits}]`, 'g');

export const convertToEnglishDigits = (str: string): string => {
  if (!str) return "";
  return str.replace(localizedDigitsRegex, (char) => conversionMap[char] || char);
};

export const toLocalizedDigits = (numStr: string, locale: keyof typeof digitsMap): string => {
  if (!numStr || !digitsMap[locale]) return numStr;
  const localeDigits = digitsMap[locale];
  return numStr.replace(/\d/g, (digit) => localeDigits[parseInt(digit, 10)]);
};

export const localizeDecimalSeparator = (numStr: string, locale: keyof typeof decimalSeparatorMap): string => {
  const separator = decimalSeparatorMap[locale];
  if (!separator || !numStr.includes('.')) return numStr; // فقط اگر نقطه انگلیسی وجود داشت جایگزین کن
  return numStr.replace('.', separator);
};

export const groupDigits = (
  numStr: string,
  separatorCount: number,
  separatorChar = ','
): string => {
  if (!numStr || separatorCount <= 0) {
    return numStr;
  }
  // فقط روی قسمت صحیح اعمال شود (اگر فقط قسمت صحیح داده شده)
  const regex = new RegExp(`\\B(?=(\\d{${separatorCount}})+(?!\\d))`, 'g');
  return numStr.replace(regex, separatorChar);
};


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
export const sanitizeNumericInput = (
    value: string | number | null | undefined,
    inputDecimalSeparator: string = '.'
): string => {
    if (value === null || value === undefined) return '';
    let str = String(value);

    // 1. تبدیل ارقام محلی به انگلیسی
    str = convertToEnglishDigits(str);

    // 2. تبدیل جداکننده اعشار فارسی (٫) به نقطه استاندارد (.)
    str = str.replace(/٫/g, '.');

    // 3. تبدیل جداکننده اعشار ورودی دلخواه (اگر با نقطه استاندارد فرق دارد) به نقطه استاندارد
    const standardSeparator = '.';
    if (inputDecimalSeparator && inputDecimalSeparator !== standardSeparator) {
        // برای جلوگیری از خطای regex با کاراکترهای خاص، آن را escape می‌کنیم
        const escapedSeparator = inputDecimalSeparator.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const sepRegex = new RegExp(escapedSeparator, 'g');
        str = str.replace(sepRegex, standardSeparator);
    }

    // 4. مدیریت علامت منفی: فقط یک منفی در ابتدا مجاز است
    const negative = str.startsWith('-');
    // تمام کاراکترهای غیر از عدد و نقطه استاندارد را حذف کن (منفی را جداگانه بررسی کردیم)
    str = str.replace(/[^0-9.]/g, '');

    // 5. مدیریت نقطه اعشار: فقط اولین نقطه مجاز است
    const firstDotIndex = str.indexOf(standardSeparator);
    if (firstDotIndex !== -1) {
        const integerPart = str.substring(0, firstDotIndex);
        // قسمت اعشاری شامل همه چیز بعد از نقطه اول است، و نقاط اضافی در آن حذف می‌شود
        const fractionalPart = str.substring(firstDotIndex + 1).replace(/\./g, '');
        str = `${integerPart}${standardSeparator}${fractionalPart}`;
    }

    // 6. بازگرداندن علامت منفی در صورت لزوم
    //    فقط اگر رشته خالی نباشد و فقط نقطه نباشد، منفی را اضافه کن
    if (negative && str !== '' && str !== standardSeparator) {
        str = `-${str}`;
    }

    // 7. مدیریت صفرهای پیشرو در قسمت صحیح (بعد از پردازش منفی و نقطه)
    // مثال: "-005.1" -> "-5.1", "005" -> "5", "0.5" -> "0.5"
    let sign = '';
    let numericPart = str;
    if (str.startsWith('-')) {
        sign = '-';
        numericPart = str.substring(1);
    }

    let [intPart, fracPart] = numericPart.split(standardSeparator);

    if (intPart && intPart.length > 1 && intPart.startsWith('0')) {
        intPart = intPart.replace(/^0+/, '');
        if (intPart === '') intPart = '0'; // اگر فقط صفر بود، 0 بماند (مثل 0.5)
    } else if (intPart === '') {
        // اگر رشته با نقطه شروع شود (مثلا ".5")
        if (fracPart !== undefined) {
            intPart = '0';
        }
    }

    // بازسازی رشته نهایی
    if (fracPart !== undefined) {
        str = `${sign}${intPart}${standardSeparator}${fracPart}`;
    } else if (intPart !== undefined) {
        str = `${sign}${intPart}`;
        // اگر ورودی اصلی فقط جداکننده بود، خروجی باید '.' باشد
        if (value === inputDecimalSeparator && sign === '') {
             str = '.';
        }
         // اگر ورودی اصلی فقط '-' بود
         if (value === '-' && sign === '-' && intPart === undefined) {
             str = '-';
         }
    } else if (sign === '-' && value === '-') {
         // اگر ورودی فقط '-' بود و پردازش‌ها آن را حذف کردند
         str = '-';
    } else {
        // موارد دیگر که ممکن است خالی شوند
        str = '';
    }


    // اجازه دادن به حالت‌های بینابینی در تایپ
     if (value === '-') return '-';
     if (String(value).endsWith(inputDecimalSeparator) && str === `${sign}${intPart}`) {
         // اگر کاربر جداکننده را تایپ کرده ولی هنوز عددی بعدش نیامده
         return `${str}${standardSeparator}`;
     }


    return str;
};


/**
 * گرد کردن یا محدود کردن تعداد ارقام اعشار یک رشته عددی (انگلیسی).
 * مهم: این تابع نقطه انتهایی را حفظ می‌کند اگر ورودی با نقطه تمام شود و maxDecimals صفر نباشد.
 * @param value رشته عددی با ارقام انگلیسی و نقطه استاندارد.
 * @param maxDecimals حداکثر تعداد اعشار مجاز (undefined یعنی بدون محدودیت).
 * @returns رشته گرد شده یا محدود شده.
 */
export const roundToDecimals = (value: string, maxDecimals?: number): string => {
    // اگر مقدار نامعتبر، بدون نقطه یا بدون نیاز به گرد کردن است، همان را برگردان
    if (maxDecimals === undefined || !value || !value.includes('.')) {
        return value;
    }

    const standardSeparator = '.';
    const endsWithSeparator = value.endsWith(standardSeparator);
    let [integerPart, fractionalPart = ''] = value.split(standardSeparator);

    // اگر maxDecimals صفر است، قسمت صحیح را برگردان
    if (maxDecimals <= 0) {
        // اگر قسمت صحیح خالی بود (مثلا در حالت '-.')، صفر را برگردان
        return integerPart === '' && value.startsWith('-') ? "-0" : (integerPart || "0");
         // بازگشت بهتر: فقط قسمت صحیح
         return integerPart || "0";
    }

    // قسمت اعشار را به تعداد مجاز کوتاه کن
    const trimmedFractional = fractionalPart.slice(0, maxDecimals);

    // بازسازی رشته
    if (trimmedFractional) {
        return `${integerPart}${standardSeparator}${trimmedFractional}`;
    } else {
        // اگر قسمت اعشاری بعد از کوتاه کردن خالی شد
        // اگر ورودی اصلی با نقطه تمام شده بود، نقطه را حفظ کن
        if (endsWithSeparator) {
            return `${integerPart}${standardSeparator}`;
        } else {
            // در غیر این صورت فقط قسمت صحیح را برگردان
            return integerPart;
        }
    }
};