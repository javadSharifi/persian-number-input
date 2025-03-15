import React, { useState, useCallback } from 'react';
import { toLocalizedDigits, groupDigits, convertToEnglishDigits } from '../utils/digitUtils';

export interface PersianNumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    initialValue?: string;
    separatorCount?: number;
    separatorChar?: string;
    lang?: 'fa' | 'in' | 'en';
    onChangeValue?: (englishNumber: string) => void;
}

const PersianNumberInput: React.FC<PersianNumberInputProps> = ({
    initialValue = '',
    separatorCount = 0,
    separatorChar = ',',
    lang = 'fa',
    onChangeValue,
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

    return <input {...rest} value={displayValue} onChange={handleChange} />;
};

export default PersianNumberInput;