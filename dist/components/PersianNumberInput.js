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
const react_1 = require("react");
const usePersianNumberInput_1 = require("../hooks/usePersianNumberInput");
const PersianNumberInput = (0, react_1.forwardRef)((props, ref) => {
    const { initialValue, separatorCount, separatorChar, locale, showZero, onValueChange, min, max, maxDecimals } = props, rest = __rest(props, ["initialValue", "separatorCount", "separatorChar", "locale", "showZero", "onValueChange", "min", "max", "maxDecimals"]);
    const { value, onChange, inputRef } = (0, usePersianNumberInput_1.usePersianNumberInput)({
        initialValue,
        separatorCount,
        separatorChar,
        locale,
        showZero,
        onValueChange,
        min,
        max,
        maxDecimals,
    });
    (0, react_1.useImperativeHandle)(ref, () => inputRef.current);
    return ((0, jsx_runtime_1.jsx)("input", Object.assign({}, rest, { ref: inputRef, type: "text", inputMode: "decimal", dir: "ltr", value: value, onChange: onChange })));
});
PersianNumberInput.displayName = "PersianNumberInput";
exports.default = PersianNumberInput;
//# sourceMappingURL=PersianNumberInput.js.map