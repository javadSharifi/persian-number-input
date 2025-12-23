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
const usePersianNumberInput = ({ initialValue, separatorCount = 3, separatorChar = ",", locale = "fa", showZero = false, onValueChange, min, max, maxDecimals, } = {}) => {
    const [rawValue, setRawValue] = (0, react_1.useState)(() => (0, digitUtils_1.sanitizeNumericInput)(initialValue, maxDecimals));
    const inputRef = (0, react_1.useRef)(null);
    const selectionRef = (0, react_1.useRef)(null);
    (0, react_1.useLayoutEffect)(() => {
        if (inputRef.current && selectionRef.current !== null) {
            inputRef.current.setSelectionRange(selectionRef.current, selectionRef.current);
        }
    });
    const updateValue = (0, react_1.useCallback)((nextRaw) => {
        if (nextRaw !== "" &&
            nextRaw !== "-" &&
            nextRaw !== "." &&
            nextRaw !== "-.") {
            try {
                const num = new decimal_js_1.default(nextRaw);
                if (min !== undefined && num.lt(min))
                    return;
                if (max !== undefined && num.gt(max))
                    return;
            }
            catch (_a) {
                return;
            }
        }
        setRawValue(nextRaw);
        onValueChange === null || onValueChange === void 0 ? void 0 : onValueChange(nextRaw);
    }, [min, max, onValueChange]);
    const onChange = (event) => {
        const input = event.target;
        const value = input.value;
        const sanitized = (0, digitUtils_1.sanitizeNumericInput)(value, maxDecimals);
        const prevFormatted = (0, transformNumber_1.transformNumber)(rawValue, {
            separatorCount,
            separatorChar,
            locale,
            showZero,
        });
        const nextFormatted = (0, transformNumber_1.transformNumber)(sanitized, {
            separatorCount,
            separatorChar,
            locale,
            showZero,
        });
        let cursor = input.selectionStart || 0;
        const diff = nextFormatted.length - prevFormatted.length;
        selectionRef.current = cursor + (diff > 0 ? diff : diff);
        updateValue(sanitized);
    };
    const displayValue = (0, transformNumber_1.transformNumber)(rawValue, {
        separatorCount,
        separatorChar,
        locale,
        showZero,
        maxDecimals,
    });
    return {
        value: displayValue,
        onChange,
        rawValue,
        inputRef,
        setRawValue: updateValue,
    };
};
exports.usePersianNumberInput = usePersianNumberInput;
//# sourceMappingURL=usePersianNumberInput.js.map