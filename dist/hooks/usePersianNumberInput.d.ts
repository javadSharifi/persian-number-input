import React from "react";
import { TransformNumberOptions } from "../utils/transformNumber";
interface UsePersianNumberInputProps extends Omit<TransformNumberOptions, "maxDecimals"> {
    initialValue?: number | string;
    onValueChange?: (value: string | undefined) => void;
    min?: number;
    max?: number;
    maxDecimals?: number;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
}
export declare const usePersianNumberInput: (props?: UsePersianNumberInputProps) => {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    rawValue: string | undefined;
    inputRef: React.RefObject<HTMLInputElement | null>;
    setRawValue: (nextRaw: string) => void;
};
export {};
//# sourceMappingURL=usePersianNumberInput.d.ts.map