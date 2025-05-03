import React from 'react';
import type { TransformNumberOptions } from '../utils/transformNumber';
interface PersianNumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'min' | 'max'>, // min/max از نوع input حذف شد چون خودمان هندل می‌کنیم
Omit<TransformNumberOptions, 'maxDecimals'> {
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
declare const PersianNumberInput: React.FC<PersianNumberInputProps>;
export default PersianNumberInput;
//# sourceMappingURL=PersianNumberInput.d.ts.map