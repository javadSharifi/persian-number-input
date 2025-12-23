export declare const digitsMap: Record<string, string[]>;
export declare const decimalSeparatorMap: Record<string, string>;
export declare const toEnglishDigits: (str: string) => string;
export declare const convertToEnglishDigits: (str: string) => string;
export declare const toLocalizedDigits: (numStr: string, locale: string) => string;
export declare const localizeDecimalSeparator: (numStr: string, locale: string) => string;
export declare const groupDigits: (numStr: string, separatorCount: number, separatorChar?: string) => string;
export declare const sanitizeNumericInput: (value: string | number | null | undefined, maxDecimals?: number) => string;
export declare const roundToDecimals: (value: string, maxDecimals?: number) => string;
//# sourceMappingURL=digitUtils.d.ts.map