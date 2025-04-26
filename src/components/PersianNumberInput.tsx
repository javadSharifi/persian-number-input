import React from 'react';
import { usePersianNumberInput } from '../hooks/usePersianNumberInput';
import type { TransformNumberOptions } from '../utils/transformNumber';

// پراپ های کامپوننت می تواند شامل آپشن های هوک و پراپ های استاندارد input باشد
interface PersianNumberInputProps
    extends TransformNumberOptions,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    // می توانید پراپ های دیگری هم اضافه کنید
    onValueChange?: (value: string | undefined) => void;
    initialValue?: number | string;
    min?: number; // پشتیبانی از اعشار
    max?: number; // پشتیبانی از اعشار
}

const PersianNumberInput: React.FC<PersianNumberInputProps> = ({
    // جدا کردن آپشن های هوک از بقیه پراپ های input
    initialValue,
    separatorCount,
    separatorChar,
    locale,
    maxDecimals,
    showZero,
    onValueChange,
    min,
    max,
    // بقیه پراپ ها (مثل className, style, placeholder, id و ...) به input اصلی منتقل می شوند
    ...restInputProps
}) => {
    // اعتبارسنجی پراپ‌ها
    if (maxDecimals !== undefined && maxDecimals < 0) {
        console.warn('maxDecimals باید غیرمنفی باشد');
        maxDecimals = 0;
    }
    if (min !== undefined && max !== undefined && min > max) {
        console.warn('min نباید بزرگ‌تر از max باشد');
    }

    const {
        value: formattedValue,
        onChange,
        rawValue, // می توانید rawValue را هم برگردانید اگر لازم است
    } = usePersianNumberInput({
        initialValue,
        separatorCount,
        separatorChar,
        locale,
        maxDecimals,
        showZero,
        onValueChange,
        min,
        max
    });

    return (
        <input
            type="text" // یا "tel" هم گاهی استفاده می شود
            inputMode="decimal"
            dir="ltr" // معمولا برای اعداد بهتر است
            {...restInputProps} // اعمال پراپ های اضافی مثل className, id, placeholder ...
            value={formattedValue}
            onChange={onChange}
        />
    );
};

export default PersianNumberInput;