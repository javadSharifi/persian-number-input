import React, { useCallback } from 'react';
import { toLocalizedDigits, groupDigits, convertToEnglishDigits } from '../utils/digitUtils';

// Props مخصوص کامپوننت
interface PersianNumberInputCustomProps {
    initialValue?: string;
    separatorCount?: number;
    separatorChar?: string;
    lang?: 'fa' | 'in' | 'en';
    onChangeValue?: (englishNumber: string) => void;
}

// Props مجاز برای input
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
    // Event handlers
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

// ترکیب props های مجاز
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
    const [value, setValue] = React.useState(() => convertToEnglishDigits(initialValue).replace(/\D/g, ''));

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const input = convertToEnglishDigits(e.target.value).replace(/\D/g, '');
        setValue(input);
        if (onChangeValue) onChangeValue(input);
    }, [onChangeValue]);

    const formattedValue = groupDigits(value, separatorCount, separatorChar);
    const displayValue = lang === 'en' ? formattedValue : toLocalizedDigits(formattedValue, lang);

    const mergedStyle = { ...baseInputStyle, ...style };

    return <input
        value={displayValue}
        onChange={handleChange}
        style={mergedStyle}
        {...rest}
    />;
};

export default PersianNumberInput;