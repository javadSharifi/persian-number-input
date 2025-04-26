"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const usePersianNumberInput_1 = require("../hooks/usePersianNumberInput");
const PersianNumberInput = (_a) => {
    var { 
    // جدا کردن آپشن های هوک از بقیه پراپ های input
    initialValue, separatorCount, separatorChar, locale, maxDecimals, showZero, onValueChange, min, max } = _a, 
    // بقیه پراپ ها (مثل className, style, placeholder, id و ...) به input اصلی منتقل می شوند
    restInputProps = __rest(_a, ["initialValue", "separatorCount", "separatorChar", "locale", "maxDecimals", "showZero", "onValueChange", "min", "max"]);
    // اعتبارسنجی پراپ‌ها
    if (maxDecimals !== undefined && maxDecimals < 0) {
        console.warn('maxDecimals باید غیرمنفی باشد');
        maxDecimals = 0;
    }
    if (min !== undefined && max !== undefined && min > max) {
        console.warn('min نباید بزرگ‌تر از max باشد');
    }
    const { value: formattedValue, onChange, rawValue, // می توانید rawValue را هم برگردانید اگر لازم است
     } = (0, usePersianNumberInput_1.usePersianNumberInput)({
        initialValue,
        separatorCount,
        separatorChar,
        locale,
        maxDecimals,
        showZero,
        onValueChange,
        min,
        max
    });
    return ((0, jsx_runtime_1.jsx)("input", Object.assign({ type: "text" // یا "tel" هم گاهی استفاده می شود
        , inputMode: "decimal", dir: "ltr" // معمولا برای اعداد بهتر است
     }, restInputProps, { value: formattedValue, onChange: onChange })));
};
exports.default = PersianNumberInput;
//# sourceMappingURL=PersianNumberInput.js.map