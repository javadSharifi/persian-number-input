// components/PersianNumberInput.tsx
import React from 'react';
import { usePersianNumberInput } from '../hooks/usePersianNumberInput';
// TransformNumberOptions دیگر مستقیما از اینجا لازم نیست، مگر برای تعریف نوع پراپ
import type { TransformNumberOptions } from '../utils/transformNumber';

// پراپ های کامپوننت
interface PersianNumberInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'min' | 'max'>, // min/max از نوع input حذف شد چون خودمان هندل می‌کنیم
    Omit<TransformNumberOptions, 'maxDecimals'> // options مربوط به نمایش
{
    /** مقدار اولیه */
    initialValue?: number | string;
    /** تابعی که با تغییر مقدار خام (انگلیسی و بدون فرمت) فراخوانی می‌شود */
    onValueChange?: (value: string | undefined) => void;
    /** حداقل مقدار مجاز (اعشار پشتیبانی می‌شود) */
    min?: number;
    /** حداکثر مقدار مجاز (اعشار پشتیبانی می‌شود) */
    max?: number;
    /** حداکثر تعداد ارقام اعشار مجاز (undefined یعنی نامحدود) */
    maxDecimals?: number;
    /** کاراکتری که کاربر برای وارد کردن اعشار استفاده می‌کند (پیش‌فرض '.') */
    inputDecimalSeparator?: string;
}

const PersianNumberInput: React.FC<PersianNumberInputProps> = ({
    // جدا کردن آپشن های هوک و نمایش از بقیه پراپ های input
    initialValue,
    separatorCount,
    separatorChar,
    locale,
    showZero,
    onValueChange,
    min,
    max,
    maxDecimals,
    inputDecimalSeparator, // پراپ جدید
    // بقیه پراپ ها (مثل className, style, placeholder, id, disabled و ...) به input اصلی منتقل می شوند
    ...restInputProps
}) => {
    // اعتبارسنجی پراپ‌ها (اختیاری ولی خوب)
    if (maxDecimals !== undefined && maxDecimals < 0) {
        console.warn('maxDecimals باید غیرمنفی باشد');
        maxDecimals = 0;
    }
    if (min !== undefined && max !== undefined && min > max) {
        console.warn('min نباید بزرگ‌تر از max باشد');
        // شاید بهتر باشد یکی را نادیده گرفت یا خطا داد؟ فعلا فقط هشدار.
    }

    const {
        value: formattedValue, // مقدار فرمت شده برای نمایش
        onChange,             // تابع onChange برای input
        // setValue,          // اگر نیاز به تنظیم مقدار از بیرون دارید
        // rawValue,          // مقدار خام انگلیسی بدون فرمت (اگر لازم دارید)
    } = usePersianNumberInput({
        initialValue,
        separatorCount,
        separatorChar,
        locale,
        showZero,
        onValueChange,
        min,
        max,
        maxDecimals,
        inputDecimalSeparator, // پاس دادن پراپ جدید به هوک
    });

    return (
        <input
            type="text" // استفاده از text به جای number برای کنترل کامل فرمت
            inputMode="decimal" // کیبورد مناسب در موبایل را نشان می‌دهد
            dir="ltr" // برای اعداد معمولا ltr بهتر است، حتی در متن فارسی
            {...restInputProps} // اعمال پراپ های اضافی مثل className, id, placeholder ...
            value={formattedValue} // مقدار فرمت شده نمایش داده می‌شود
            onChange={onChange}   // مدیریت تغییرات توسط هوک
        />
    );
};

export default PersianNumberInput;