// utils/digitUtils.ts

/**
 * نقشه ارقام محلی برای زبان‌های مختلف.
 */
export const digitsMap: { [key: string]: ReadonlyArray<string> } = {
  fa: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
  // می‌توانید زبان‌های دیگر را اضافه کنید
  // in: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
};

/**
 * نقشه جداکننده اعشار برای زبان‌های مختلف.
 */
export const decimalSeparatorMap: { [key: string]: string } = {
  fa: "٫",
  // en: ".",
};

// همه ارقام محلی را به یک رشته واحد می‌چسبانیم تا regex بسازیم
const allLocalizedDigits = Object.values(digitsMap).flat().join("");

// مپ برای تبدیل رقم محلی به رقم انگلیسی
const conversionMap: { [key: string]: string } = {};
for (const locale in digitsMap) {
  digitsMap[locale].forEach((digit, index) => {
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
export const convertToEnglishDigits = (str: string): string => {
  if (!str) return "";
  return str.replace(localizedDigitsRegex, (char) => conversionMap[char] || char);
};

/**
 * تبدیل رشته حاوی ارقام انگلیسی (0-9) به رشته با ارقام محلی.
 * @param numStr رشته با ارقام انگلیسی
 * @param locale کد زبان ('fa', 'in', ...)
 * @returns رشته با ارقام محلی
 */
export const toLocalizedDigits = (numStr: string, locale: keyof typeof digitsMap): string => {
  if (!numStr || !digitsMap[locale]) return numStr;
  const localeDigits = digitsMap[locale];
  return numStr.replace(/\d/g, (digit) => localeDigits[parseInt(digit, 10)]);
};

/**
 * جایگزینی جداکننده اعشار انگلیسی (.) با جداکننده محلی.
 * @param numStr رشته با ارقام و جداکننده انگلیسی
 * @param locale کد زبان
 * @returns رشته با جداکننده اعشار محلی
 */
export const localizeDecimalSeparator = (numStr: string, locale: keyof typeof decimalSeparatorMap): string => {
  const separator = decimalSeparatorMap[locale];
  if (!separator) return numStr;
  return numStr.replace('.', separator);
};

/**
 * گروه‌بندی ارقام قسمت صحیح یک عدد با استفاده از جداکننده.
 * @param numStr قسمت صحیح عدد (فقط ارقام انگلیسی)
 * @param separatorCount تعداد ارقام در هر گروه
 * @param separatorChar کاراکتر جداکننده
 * @returns رشته گروه‌بندی شده
 */
export const groupDigits = (
  numStr: string,
  separatorCount: number,
  separatorChar = ','
): string => {
  if (!numStr || separatorCount <= 0) {
    return numStr;
  }
  const regex = new RegExp(`\\B(?=(\\d{${separatorCount}})+(?!\\d))`, 'g');
  return numStr.replace(regex, separatorChar);
};

/**
 * پاک‌سازی ورودی عددی برای اجازه دادن به کاراکترهای مجاز (اعداد، نقطه و منفی).
 * این نسخه جدید: ارقام فارسی و جداکننده اعشار فارسی را هم پشتیبانی می‌کند.
 * @param value - رشته ورودی
 * @returns رشته پاک‌شده
 */
export const sanitizeNumericInput = (value: string): string => {
  // ۱) تبدیل ارقام فارسی به انگلیسی
  let normalized = convertToEnglishDigits(value);
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
