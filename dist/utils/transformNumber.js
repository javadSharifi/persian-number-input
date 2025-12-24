"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformNumber = void 0;
const digitUtils_1 = require("./digitUtils");
const transformNumber = (rawValue, options) => {
    const { separatorCount = 3, separatorChar = ",", locale = "fa", showZero = false, } = options || {};
    if (rawValue === null || rawValue === undefined || rawValue === "") {
        return showZero ? (0, digitUtils_1.toLocalizedDigits)("0", locale) : "";
    }
    let [integerPart, fractionalPart] = rawValue.split(".");
    const hasTrailingDot = rawValue.endsWith(".");
    const absIntPart = integerPart || (hasTrailingDot || fractionalPart !== undefined ? "0" : "");
    if (absIntPart === "" && !hasTrailingDot && fractionalPart === undefined) {
        return showZero ? (0, digitUtils_1.toLocalizedDigits)("0", locale) : "";
    }
    const groupedInt = (0, digitUtils_1.groupDigits)(absIntPart, separatorCount, separatorChar);
    let finalStr = groupedInt;
    if (fractionalPart !== undefined) {
        finalStr = `${groupedInt}.${fractionalPart}`;
    }
    else if (hasTrailingDot) {
        finalStr = `${groupedInt}.`;
    }
    if (locale !== "en") {
        finalStr = (0, digitUtils_1.localizeDecimalSeparator)(finalStr, locale);
        finalStr = (0, digitUtils_1.toLocalizedDigits)(finalStr, locale);
    }
    return finalStr;
};
exports.transformNumber = transformNumber;
//# sourceMappingURL=transformNumber.js.map