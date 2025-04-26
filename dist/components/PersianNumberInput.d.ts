import React from 'react';
import type { TransformNumberOptions } from '../utils/transformNumber';
interface PersianNumberInputProps extends TransformNumberOptions, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    onValueChange?: (value: string | undefined) => void;
    initialValue?: number | string;
    min?: number;
    max?: number;
}
declare const PersianNumberInput: React.FC<PersianNumberInputProps>;
export default PersianNumberInput;
//# sourceMappingURL=PersianNumberInput.d.ts.map