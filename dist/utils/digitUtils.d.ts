export declare const digitsMap: {
    [key: string]: string[];
};
export declare const toLocalizedDigits: (numStr: string, locale: "fa" | "in") => string;
export declare const groupDigits: (numStr: string, separatorCount: number, separatorChar?: string) => string;
export declare const convertToEnglishDigits: (str: string) => string;
