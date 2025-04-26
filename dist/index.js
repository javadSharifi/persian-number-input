"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformNumber = exports.PersianNumberInput = exports.usePersianNumberInput = void 0;
var usePersianNumberInput_1 = require("./hooks/usePersianNumberInput");
Object.defineProperty(exports, "usePersianNumberInput", { enumerable: true, get: function () { return usePersianNumberInput_1.usePersianNumberInput; } });
var PersianNumberInput_1 = require("./components/PersianNumberInput");
Object.defineProperty(exports, "PersianNumberInput", { enumerable: true, get: function () { return __importDefault(PersianNumberInput_1).default; } });
var transformNumber_1 = require("./utils/transformNumber");
Object.defineProperty(exports, "transformNumber", { enumerable: true, get: function () { return transformNumber_1.transformNumber; } });
__exportStar(require("./utils/digitUtils"), exports);
//# sourceMappingURL=index.js.map