import React from 'react';
import { TransformNumberOptions } from '../utils/transformNumber';
interface UsePersianNumberInputProps extends TransformNumberOptions {
    initialValue?: number | string;
    onValueChange?: (value: string | undefined) => void;
    min?: number;
    max?: number;
}
interface UsePersianNumberInputReturn {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setValue: (newValue: number | string | undefined) => void;
    rawValue: string | undefined;
}
export declare const usePersianNumberInput: ({ initialValue, separatorCount, separatorChar, locale, maxDecimals, showZero, onValueChange, min, max, }?: UsePersianNumberInputProps) => UsePersianNumberInputReturn;
export {};
//# sourceMappingURL=usePersianNumberInput.d.ts.map