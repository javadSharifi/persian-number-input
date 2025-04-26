"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePersianNumberInput = void 0;
// hooks/usePersianNumberInput.ts
const react_1 = require("react");
const decimal_js_1 = __importDefault(require("decimal.js"));
const transformNumber_1 = require("../utils/transformNumber");
const digitUtils_1 = require("../utils/digitUtils");
// اگر maxDecimals تعریف نشده باشد، اعشار حفظ می‌شود
const roundToDecimals = (value, maxDecimals) => {
    if (!value || !value.includes('.') || maxDecimals == null)
        return value;
    const [integerPart, fractionalPart] = value.split('.');
    if (maxDecimals === 0)
        return integerPart;
    const trimmedFractional = fractionalPart.slice(0, maxDecimals);
    return trimmedFractional ? `${integerPart}.${trimmedFractional}` : integerPart;
};
const usePersianNumberInput = ({ initialValue, separatorCount = 3, separatorChar = ',', locale = 'fa', maxDecimals, // undefined یعنی نامحدود
showZero = false, onValueChange, min, max, } = {}) => {
    const [rawValue, setRawValue] = (0, react_1.useState)(() => {
        if (initialValue == null)
            return undefined;
        let sanitized = (0, digitUtils_1.sanitizeNumericInput)(String(initialValue));
        sanitized = roundToDecimals(sanitized, maxDecimals);
        if (sanitized) {
            try {
                const numericValue = new decimal_js_1.default(sanitized);
                if ((min !== undefined && numericValue.lt(min)) ||
                    (max !== undefined && numericValue.gt(max))) {
                    return undefined;
                }
            }
            catch (error) {
                console.warn(`Invalid initial value: ${sanitized}`, error);
                return undefined;
            }
        }
        if (parseFloat(sanitized) === 0 && !showZero && sanitized !== '0') {
            return undefined;
        }
        return sanitized || undefined;
    });
    const displayValue = (0, react_1.useMemo)(() => {
        const options = { separatorCount, separatorChar, locale, maxDecimals, showZero };
        if (rawValue === undefined) {
            return showZero ? (0, transformNumber_1.transformNumber)('0', options) : '';
        }
        return (0, transformNumber_1.transformNumber)(rawValue, options);
    }, [rawValue, separatorCount, separatorChar, locale, maxDecimals, showZero]);
    const handleChange = (0, react_1.useCallback)((event) => {
        const inputValue = event.target.value;
        let sanitizedValue = (0, digitUtils_1.sanitizeNumericInput)(inputValue);
        if (sanitizedValue !== rawValue) {
            sanitizedValue = roundToDecimals(sanitizedValue, maxDecimals);
            let valueToSet = sanitizedValue;
            if (sanitizedValue) {
                try {
                    const numericValue = new decimal_js_1.default(sanitizedValue);
                    if ((min !== undefined && numericValue.lt(min)) ||
                        (max !== undefined && numericValue.gt(max))) {
                        return; // خارج از محدوده
                    }
                }
                catch (error) {
                    console.warn(`Invalid input value: ${sanitizedValue}`, error);
                    return;
                }
            }
            if (parseFloat(sanitizedValue) === 0 && !showZero && sanitizedValue !== '0.') {
                valueToSet = undefined;
            }
            setRawValue(valueToSet);
            if (onValueChange)
                onValueChange(valueToSet);
        }
    }, [rawValue, onValueChange, showZero, min, max, maxDecimals]);
    const handleSetValue = (0, react_1.useCallback)((newValue) => {
        if (newValue == null) {
            setRawValue(undefined);
            if (onValueChange)
                onValueChange(undefined);
            return;
        }
        let sanitizedValue = (0, digitUtils_1.sanitizeNumericInput)(String(newValue));
        sanitizedValue = roundToDecimals(sanitizedValue, maxDecimals);
        if (sanitizedValue) {
            try {
                const numericValue = new decimal_js_1.default(sanitizedValue);
                if ((min !== undefined && numericValue.lt(min)) ||
                    (max !== undefined && numericValue.gt(max))) {
                    return;
                }
            }
            catch (error) {
                console.warn(`Invalid set value: ${sanitizedValue}`, error);
                return;
            }
        }
        const valueToSet = parseFloat(sanitizedValue) === 0 && !showZero && sanitizedValue !== '0.'
            ? undefined
            : sanitizedValue;
        setRawValue(valueToSet);
        if (onValueChange)
            onValueChange(valueToSet);
    }, [onValueChange, showZero, min, max, maxDecimals]);
    return { value: displayValue, onChange: handleChange, setValue: handleSetValue, rawValue };
};
exports.usePersianNumberInput = usePersianNumberInput;
//# sourceMappingURL=usePersianNumberInput.js.map