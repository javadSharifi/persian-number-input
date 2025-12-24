"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePersianNumberInput = void 0;
const react_1 = require("react");
const decimal_js_1 = __importDefault(require("decimal.js"));
const transformNumber_1 = require("../utils/transformNumber");
const digitUtils_1 = require("../utils/digitUtils");
const usePersianNumberInput = (props = {}) => {
    const { initialValue, separatorCount = 3, separatorChar = ",", decimalChar, locale = "fa", showZero = false, onValueChange, min, max, maxDecimals, onBlur: externalOnBlur, } = props;
    const [rawValue, setRawValue] = (0, react_1.useState)(() => (0, digitUtils_1.sanitizeNumericInput)(initialValue, maxDecimals, decimalChar));
    const inputRef = (0, react_1.useRef)(null);
    const selectionRef = (0, react_1.useRef)(null);
    (0, react_1.useLayoutEffect)(() => {
        if (inputRef.current && selectionRef.current !== null) {
            inputRef.current.setSelectionRange(selectionRef.current, selectionRef.current);
        }
    });
    const updateValue = (0, react_1.useCallback)((nextRaw) => {
        if (nextRaw !== "" && nextRaw !== ".") {
            try {
                const num = new decimal_js_1.default(nextRaw);
                if (max !== undefined && num.gt(max))
                    return;
            }
            catch (_a) {
                return;
            }
        }
        setRawValue(nextRaw);
        onValueChange === null || onValueChange === void 0 ? void 0 : onValueChange(nextRaw);
    }, [max, onValueChange]);
    const onChange = (event) => {
        const input = event.target;
        const value = input.value;
        const sanitized = (0, digitUtils_1.sanitizeNumericInput)(value, maxDecimals, decimalChar);
        const prevFormatted = (0, transformNumber_1.transformNumber)(rawValue, {
            separatorCount,
            separatorChar,
            decimalChar,
            locale,
            showZero,
        });
        const nextFormatted = (0, transformNumber_1.transformNumber)(sanitized, {
            separatorCount,
            separatorChar,
            decimalChar,
            locale,
            showZero,
        });
        let cursor = input.selectionStart || 0;
        const diff = nextFormatted.length - prevFormatted.length;
        selectionRef.current = cursor + diff;
        updateValue(sanitized);
    };
    const onBlur = (0, react_1.useCallback)((event) => {
        if (rawValue && rawValue !== ".") {
            try {
                const num = new decimal_js_1.default(rawValue);
                if (min !== undefined && num.lt(min)) {
                    const minStr = String(min);
                    setRawValue(minStr);
                    onValueChange === null || onValueChange === void 0 ? void 0 : onValueChange(minStr);
                }
            }
            catch (_a) { }
        }
        externalOnBlur === null || externalOnBlur === void 0 ? void 0 : externalOnBlur(event);
    }, [rawValue, min, onValueChange, externalOnBlur]);
    const displayValue = (0, transformNumber_1.transformNumber)(rawValue, {
        separatorCount,
        separatorChar,
        decimalChar,
        locale,
        showZero,
        maxDecimals,
    });
    return {
        value: displayValue,
        onChange,
        onBlur,
        rawValue,
        inputRef,
        setRawValue: updateValue,
    };
};
exports.usePersianNumberInput = usePersianNumberInput;
//# sourceMappingURL=usePersianNumberInput.js.map