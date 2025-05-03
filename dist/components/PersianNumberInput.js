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
    // جدا کردن آپشن های هوک و نمایش از بقیه پراپ های input
    initialValue, separatorCount, separatorChar, locale, showZero, onValueChange, min, max, maxDecimals, inputDecimalSeparator } = _a, // پراپ جدید
    // بقیه پراپ ها (مثل className, style, placeholder, id, disabled و ...) به input اصلی منتقل می شوند
    restInputProps = __rest(_a, ["initialValue", "separatorCount", "separatorChar", "locale", "showZero", "onValueChange", "min", "max", "maxDecimals", "inputDecimalSeparator"]);
    // اعتبارسنجی پراپ‌ها (اختیاری ولی خوب)
    if (maxDecimals !== undefined && maxDecimals < 0) {
        console.warn('maxDecimals باید غیرمنفی باشد');
        maxDecimals = 0;
    }
    if (min !== undefined && max !== undefined && min > max) {
        console.warn('min نباید بزرگ‌تر از max باشد');
        // شاید بهتر باشد یکی را نادیده گرفت یا خطا داد؟ فعلا فقط هشدار.
    }
    const { value: formattedValue, // مقدار فرمت شده برای نمایش
    onChange, // تابع onChange برای input
    // setValue,          // اگر نیاز به تنظیم مقدار از بیرون دارید
    // rawValue,          // مقدار خام انگلیسی بدون فرمت (اگر لازم دارید)
     } = (0, usePersianNumberInput_1.usePersianNumberInput)({
        initialValue,
        separatorCount,
        separatorChar,
        locale,
        showZero,
        onValueChange,
        min,
        max,
        maxDecimals,
        inputDecimalSeparator, // پاس دادن پراپ جدید به هوک
    });
    return ((0, jsx_runtime_1.jsx)("input", Object.assign({ type: "text" // استفاده از text به جای number برای کنترل کامل فرمت
        , inputMode: "decimal" // کیبورد مناسب در موبایل را نشان می‌دهد
        , dir: "ltr" // برای اعداد معمولا ltr بهتر است، حتی در متن فارسی
     }, restInputProps, { value: formattedValue, onChange: onChange })));
};
exports.default = PersianNumberInput;
//# sourceMappingURL=PersianNumberInput.js.map