export interface TransformNumberOptions {
    separatorCount?: number;
    separatorChar?: string;
    decimalChar?: string;
    locale?: "fa" | "en" | "ar" | string;
    maxDecimals?: number;
    showZero?: boolean;
}
export declare const transformNumber: (rawValue: string | undefined, options?: TransformNumberOptions) => string;
//# sourceMappingURL=transformNumber.d.ts.map