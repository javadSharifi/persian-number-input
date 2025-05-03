// hooks/usePersianNumberInput.ts
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Decimal from 'decimal.js';
import { transformNumber, TransformNumberOptions } from '../utils/transformNumber';
import { sanitizeNumericInput, roundToDecimals } from '../utils/digitUtils';

// ۱. تعریف سیگنال منحصر به فرد برای خطای محدوده
const INVALID_RANGE_SIGNAL = Symbol("INVALID_RANGE");

interface UsePersianNumberInputProps extends Omit<TransformNumberOptions, 'maxDecimals'> {
  initialValue?: number | string;
  onValueChange?: (value: string | undefined) => void;
  min?: number;
  max?: number;
  maxDecimals?: number;
  inputDecimalSeparator?: string;
}

interface UsePersianNumberInputReturn {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: (newValue: number | string | undefined) => void;
  rawValue: string | undefined;
}

export const usePersianNumberInput = ({
  initialValue,
  separatorCount = 3,
  separatorChar = ',',
  locale = 'fa',
  showZero = false,
  onValueChange,
  min,
  max,
  maxDecimals,
  inputDecimalSeparator = '.',
}: UsePersianNumberInputProps = {}): UsePersianNumberInputReturn => {

  // اسم تابع برای وضوح بیشتر تغییر کرد
  const getSanitizedRoundedAndCheckedValue = useCallback((val: number | string | undefined): string | undefined | typeof INVALID_RANGE_SIGNAL => {
    // ۲. نوع خروجی تابع تغییر کرد

    if (val === null || val === undefined) return undefined;

    let sanitized = sanitizeNumericInput(String(val), inputDecimalSeparator);

    // اجازه عبور موقت به مقادیر بینابینی
    if (sanitized === '-' || sanitized === '.' || sanitized === '-.') {
       // در انتها بررسی showZero برای اینها انجام می‌شود
    } else if (sanitized) { // اگر رشته خالی یا فقط بینابینی نیست
      try {
        // تبدیل به Decimal فقط برای بررسی محدوده
        const numericValue = new Decimal(sanitized);

        // ۳. بررسی محدوده و برگرداندن سیگنال در صورت خطا
        if (min !== undefined && numericValue.lt(min)) {
          console.warn(`Value ${sanitized} is less than min ${min}. Input ignored.`);
          return INVALID_RANGE_SIGNAL; // <<< برگرداندن سیگنال
        }
        if (max !== undefined && numericValue.gt(max)) {
          console.warn(`Value ${sanitized} exceeds max ${max}. Input ignored.`);
          return INVALID_RANGE_SIGNAL; // <<< برگرداندن سیگنال
        }

        // اگر در محدوده بود، گرد کردن را اعمال کن
        sanitized = roundToDecimals(sanitized, maxDecimals);

      } catch (error) {
        console.warn(`Error processing sanitized value: ${sanitized}`, error);
        return undefined; // خطای پردازش به معنی نامعتبر بودن است
      }
    } else {
      // اگر sanitizeNumericInput رشته خالی برگرداند
      return undefined;
    }

    // مدیریت showZero برای مقدار نهایی (بعد از بررسی محدوده و گرد کردن)
    if (!showZero) {
        // مقادیر بینابینی را حذف کن اگر showZero=false
        if (sanitized === '-' || sanitized === '.' || sanitized === '-.') {
            return undefined;
        }
        try {
             // مقادیر صفر را حذف کن (مگر اینکه نقطه انتهایی داشته باشد)
             if (sanitized && new Decimal(sanitized).isZero() && !sanitized.endsWith('.')) {
                 return undefined;
             }
        } catch { /* نادیده گرفتن خطا */ }
    }

    // در نهایت، اگر رشته خالی شده، undefined برگردان
    return sanitized === '' ? undefined : sanitized;

  }, [inputDecimalSeparator, min, max, maxDecimals, showZero]);


  // ۵. مدیریت سیگنال در مقدار اولیه
  const [rawValue, setRawValue] = useState<string | undefined>(() => {
      const initialProcessed = getSanitizedRoundedAndCheckedValue(initialValue);
      // اگر مقدار اولیه خارج از محدوده بود، با undefined شروع کن
      return initialProcessed === INVALID_RANGE_SIGNAL ? undefined : initialProcessed;
  });

  // useEffect برای initialValue ممکن است نیاز به بازبینی داشته باشد

  const displayValue = useMemo(() => {
    const options = { separatorCount, separatorChar, locale, showZero, maxDecimals };
    return transformNumber(rawValue, options);
  }, [rawValue, separatorCount, separatorChar, locale, showZero, maxDecimals]);


  // ۴. اصلاح handleChange برای پردازش سیگنال
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      // دریافت مقدار پردازش شده یا سیگنال خطا
      const processedValue = getSanitizedRoundedAndCheckedValue(inputValue);

      // اگر سیگنال خطا دریافت شد، هیچ کاری نکن (مقدار قبلی حفظ می‌شود)
      if (processedValue === INVALID_RANGE_SIGNAL) {
        // اینجا می‌توانید بازخورد بصری به کاربر بدهید (مثلا لرزش input)
        return;
      }

      // اگر مقدار معتبر بود (رشته یا undefined) و با مقدار فعلی فرق داشت
      if (processedValue !== rawValue) {
        setRawValue(processedValue);
        if (onValueChange) {
          onValueChange(processedValue);
        }
      }
    },
    [rawValue, getSanitizedRoundedAndCheckedValue, onValueChange] // تابع پردازشگر به وابستگی‌ها اضافه شد
  );

  // ۴. اصلاح handleSetValue برای پردازش سیگنال
  const handleSetValue = useCallback(
    (newValue: number | string | undefined) => {
      const processedValue = getSanitizedRoundedAndCheckedValue(newValue);

      // اگر مقدار جدید خارج از محدوده است، درخواست را نادیده بگیر
      if (processedValue === INVALID_RANGE_SIGNAL) {
        console.warn(`setValue ignored: Value ${newValue} is out of range [${min}, ${max}].`);
        return;
      }

      // اگر مقدار معتبر و متفاوت بود، تنظیم کن
      if (processedValue !== rawValue) {
        setRawValue(processedValue);
        if (onValueChange) {
          onValueChange(processedValue);
        }
      }
    },
    [rawValue, min, max, getSanitizedRoundedAndCheckedValue, onValueChange] // min/max هم برای پیام هشدار اضافه شد
  );

  return { value: displayValue, onChange: handleChange, setValue: handleSetValue, rawValue };
};