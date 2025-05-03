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
// ۱. تعریف سیگنال منحصر به فرد برای خطای محدوده
const INVALID_RANGE_SIGNAL = Symbol("INVALID_RANGE");
const usePersianNumberInput = ({ initialValue, separatorCount = 3, separatorChar = ',', locale = 'fa', showZero = false, onValueChange, min, max, maxDecimals, inputDecimalSeparator = '.', } = {}) => {
    // اسم تابع برای وضوح بیشتر تغییر کرد
    const getSanitizedRoundedAndCheckedValue = (0, react_1.useCallback)((val) => {
        // ۲. نوع خروجی تابع تغییر کرد
        if (val === null || val === undefined)
            return undefined;
        let sanitized = (0, digitUtils_1.sanitizeNumericInput)(String(val), inputDecimalSeparator);
        // اجازه عبور موقت به مقادیر بینابینی
        if (sanitized === '-' || sanitized === '.' || sanitized === '-.') {
            // در انتها بررسی showZero برای اینها انجام می‌شود
        }
        else if (sanitized) { // اگر رشته خالی یا فقط بینابینی نیست
            try {
                // تبدیل به Decimal فقط برای بررسی محدوده
                const numericValue = new decimal_js_1.default(sanitized);
                // ۳. بررسی محدوده و برگرداندن سیگنال در صورت خطا
                if (min !== undefined && numericValue.lt(min)) {
                    console.warn(`Value ${sanitized} is less than min ${min}. Input ignored.`);
                    return INVALID_RANGE_SIGNAL; // <<< برگرداندن سیگنال
                }
                if (max !== undefined && numericValue.gt(max)) {
                    console.warn(`Value ${sanitized} exceeds max ${max}. Input ignored.`);
                    return INVALID_RANGE_SIGNAL; // <<< برگرداندن سیگنال
                }
                // اگر در محدوده بود، گرد کردن را اعمال کن
                sanitized = (0, digitUtils_1.roundToDecimals)(sanitized, maxDecimals);
            }
            catch (error) {
                console.warn(`Error processing sanitized value: ${sanitized}`, error);
                return undefined; // خطای پردازش به معنی نامعتبر بودن است
            }
        }
        else {
            // اگر sanitizeNumericInput رشته خالی برگرداند
            return undefined;
        }
        // مدیریت showZero برای مقدار نهایی (بعد از بررسی محدوده و گرد کردن)
        if (!showZero) {
            // مقادیر بینابینی را حذف کن اگر showZero=false
            if (sanitized === '-' || sanitized === '.' || sanitized === '-.') {
                return undefined;
            }
            try {
                // مقادیر صفر را حذف کن (مگر اینکه نقطه انتهایی داشته باشد)
                if (sanitized && new decimal_js_1.default(sanitized).isZero() && !sanitized.endsWith('.')) {
                    return undefined;
                }
            }
            catch ( /* نادیده گرفتن خطا */_a) { /* نادیده گرفتن خطا */ }
        }
        // در نهایت، اگر رشته خالی شده، undefined برگردان
        return sanitized === '' ? undefined : sanitized;
    }, [inputDecimalSeparator, min, max, maxDecimals, showZero]);
    // ۵. مدیریت سیگنال در مقدار اولیه
    const [rawValue, setRawValue] = (0, react_1.useState)(() => {
        const initialProcessed = getSanitizedRoundedAndCheckedValue(initialValue);
        // اگر مقدار اولیه خارج از محدوده بود، با undefined شروع کن
        return initialProcessed === INVALID_RANGE_SIGNAL ? undefined : initialProcessed;
    });
    // useEffect برای initialValue ممکن است نیاز به بازبینی داشته باشد
    const displayValue = (0, react_1.useMemo)(() => {
        const options = { separatorCount, separatorChar, locale, showZero, maxDecimals };
        return (0, transformNumber_1.transformNumber)(rawValue, options);
    }, [rawValue, separatorCount, separatorChar, locale, showZero, maxDecimals]);
    // ۴. اصلاح handleChange برای پردازش سیگنال
    const handleChange = (0, react_1.useCallback)((event) => {
        const inputValue = event.target.value;
        // دریافت مقدار پردازش شده یا سیگنال خطا
        const processedValue = getSanitizedRoundedAndCheckedValue(inputValue);
        // اگر سیگنال خطا دریافت شد، هیچ کاری نکن (مقدار قبلی حفظ می‌شود)
        if (processedValue === INVALID_RANGE_SIGNAL) {
            // اینجا می‌توانید بازخورد بصری به کاربر بدهید (مثلا لرزش input)
            return;
        }
        // اگر مقدار معتبر بود (رشته یا undefined) و با مقدار فعلی فرق داشت
        if (processedValue !== rawValue) {
            setRawValue(processedValue);
            if (onValueChange) {
                onValueChange(processedValue);
            }
        }
    }, [rawValue, getSanitizedRoundedAndCheckedValue, onValueChange] // تابع پردازشگر به وابستگی‌ها اضافه شد
    );
    // ۴. اصلاح handleSetValue برای پردازش سیگنال
    const handleSetValue = (0, react_1.useCallback)((newValue) => {
        const processedValue = getSanitizedRoundedAndCheckedValue(newValue);
        // اگر مقدار جدید خارج از محدوده است، درخواست را نادیده بگیر
        if (processedValue === INVALID_RANGE_SIGNAL) {
            console.warn(`setValue ignored: Value ${newValue} is out of range [${min}, ${max}].`);
            return;
        }
        // اگر مقدار معتبر و متفاوت بود، تنظیم کن
        if (processedValue !== rawValue) {
            setRawValue(processedValue);
            if (onValueChange) {
                onValueChange(processedValue);
            }
        }
    }, [rawValue, min, max, getSanitizedRoundedAndCheckedValue, onValueChange] // min/max هم برای پیام هشدار اضافه شد
    );
    return { value: displayValue, onChange: handleChange, setValue: handleSetValue, rawValue };
};
exports.usePersianNumberInput = usePersianNumberInput;
//# sourceMappingURL=usePersianNumberInput.js.map