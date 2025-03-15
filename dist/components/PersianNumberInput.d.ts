import React from 'react';
export interface PersianNumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    initialValue?: string;
    separatorCount?: number;
    separatorChar?: string;
    lang?: 'fa' | 'in' | 'en';
    onChangeValue?: (englishNumber: string) => void;
}
declare const PersianNumberInput: React.FC<PersianNumberInputProps>;
export default PersianNumberInput;
