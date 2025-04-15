import React, { useCallback, useState } from 'react';
import { toLocalizedDigits, groupDigits, convertToEnglishDigits } from '../utils/digitUtils';

// تایپ پروپ‌ها با استفاده از TypeScript برای ایمنی بیشتر
interface PersianNumberInputCustomProps {
    initialValue?: string;
    separatorCount?: number;
    separatorChar?: string;
    lang?: 'fa' | 'in' | 'en';
    onChangeValue?: (englishNumber: string) => void;
}

type AllowedInputProps = Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'className'
    | 'style'
    | 'placeholder'
    | 'disabled'
    | 'readOnly'
    | 'id'
    | 'name'
    | 'autoComplete'
    | 'autoFocus'
    | 'maxLength'
    | 'minLength'
    | 'required'
    | 'title'
    | 'dir'
    | 'onClick'
    | 'onKeyDown'
    | 'onKeyUp'
    | 'onKeyPress'
    | 'onFocus'
    | 'onBlur'
    | 'onMouseDown'
    | 'onMouseUp'
    | 'onMouseEnter'
    | 'onMouseLeave'
    | 'onTouchStart'
    | 'onTouchEnd'
    | 'onPaste'
>;

// استایل پایه برای input
const baseInputStyle: React.CSSProperties = {
    border: '1px solid #ccc',
    borderRadius: '4px',
};

export type PersianNumberInputProps = PersianNumberInputCustomProps & AllowedInputProps;

const PersianNumberInput: React.FC<PersianNumberInputProps> = ({
    initialValue = '',
    separatorCount = 0,
    separatorChar = ',',
    lang = 'fa',
    onChangeValue,
    style,
    ...rest
}) => {
    // تابع برای اعتبارسنجی ورودی و جلوگیری از کاراکترهای غیرمجاز
    const sanitizeInput = (input: string) => input.replace(/[^\d,]/g, '');

    const [value, setValue] = useState(() => convertToEnglishDigits(initialValue).replace(/\D/g, ''));

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        // فیلتر کردن ورودی‌های غیرمجاز
        const input = sanitizeInput(convertToEnglishDigits(e.target.value));
        setValue(input);
        if (onChangeValue) onChangeValue(input);
    }, [onChangeValue]);

    const formattedValue = groupDigits(value, separatorCount, separatorChar);
    const displayValue = lang === 'en' ? formattedValue : toLocalizedDigits(formattedValue, lang);

    const mergedStyle = { ...baseInputStyle, ...style };

    return (
        <input
            value={displayValue}
            onChange={handleChange}
            style={mergedStyle}
            {...rest}
        />
    );
};

export default PersianNumberInput;
