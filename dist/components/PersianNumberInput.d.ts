import React from "react";
import type { TransformNumberOptions } from "../utils/transformNumber";
interface PersianNumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "min" | "max">, Omit<TransformNumberOptions, "maxDecimals"> {
    initialValue?: number | string;
    onValueChange?: (value: string | undefined) => void;
    min?: number;
    max?: number;
    maxDecimals?: number;
}
declare const PersianNumberInput: React.ForwardRefExoticComponent<PersianNumberInputProps & React.RefAttributes<HTMLInputElement>>;
export default PersianNumberInput;
//# sourceMappingURL=PersianNumberInput.d.ts.map