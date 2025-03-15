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
const PersianNumberInput = (_a) => {
    var { initialValue = '', separatorCount = 0, separatorChar = ',', lang = 'fa', onChangeValue } = _a, rest = __rest(_a, ["initialValue", "separatorCount", "separatorChar", "lang", "onChangeValue"]);
    const [value, setValue] = React.useState(() => convertToEnglishDigits(initialValue).replace(/\D/g, ''));
    const handleChange = useCallback((e) => {
        const input = convertToEnglishDigits(e.target.value).replace(/\D/g, '');
        setValue(input);
        if (onChangeValue)
            onChangeValue(input);
    }, [onChangeValue]);
    const formattedValue = groupDigits(value, separatorCount, separatorChar);
    const displayValue = lang === 'en' ? formattedValue : toLocalizedDigits(formattedValue, lang);
    return React.createElement("input", Object.assign({}, rest, { value: displayValue, onChange: handleChange }));
};
export default PersianNumberInput;
