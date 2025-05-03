import React from 'react';
import { TransformNumberOptions } from '../utils/transformNumber';
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
export declare const usePersianNumberInput: ({ initialValue, separatorCount, separatorChar, locale, showZero, onValueChange, min, max, maxDecimals, inputDecimalSeparator, }?: UsePersianNumberInputProps) => UsePersianNumberInputReturn;
export {};
//# sourceMappingURL=usePersianNumberInput.d.ts.map