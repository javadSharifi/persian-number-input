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
import React, { useCallback } from 'react';
import { toLocalizedDigits, groupDigits, convertToEnglishDigits } from '../utils/digitUtils';
// استایل پایه برای input
const baseInputStyle = {
    border: '1px solid #ccc',
    borderRadius: '4px',
};
const PersianNumberInput = (_a) => {
    var { initialValue = '', separatorCount = 0, separatorChar = ',', lang = 'fa', onChangeValue, style } = _a, rest = __rest(_a, ["initialValue", "separatorCount", "separatorChar", "lang", "onChangeValue", "style"]);
    const [value, setValue] = React.useState(() => convertToEnglishDigits(initialValue).replace(/\D/g, ''));
    const handleChange = useCallback((e) => {
        const input = convertToEnglishDigits(e.target.value).replace(/\D/g, '');
        setValue(input);
        if (onChangeValue)
            onChangeValue(input);
    }, [onChangeValue]);
    const formattedValue = groupDigits(value, separatorCount, separatorChar);
    const displayValue = lang === 'en' ? formattedValue : toLocalizedDigits(formattedValue, lang);
    const mergedStyle = Object.assign(Object.assign({}, baseInputStyle), style);
    return React.createElement("input", Object.assign({ value: displayValue, onChange: handleChange, style: mergedStyle }, rest));
};
export default PersianNumberInput;
//# sourceMappingURL=PersianNumberInput.js.map