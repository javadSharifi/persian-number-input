# ورودی عدد فارسی برای React — تبدیل خودکار ارقام فارسی، عربی و RTL

English | [فارسی](./README.fa.md)

یک کامپوننت React برای **ورودی اعداد فارسی و عربی** با تبدیل خودکار ارقام، جداکننده هزارگان، کنترل دقت اعشاری و پشتیبانی کامل از RTL. کاربر ارقام فارسی تایپ می‌کند، فرم شما عدد انگلیسی تمیز دریافت می‌کند — بدون هیچ تبدیل دستی.

[![نسخه npm](https://img.shields.io/npm/v/persian-number-input.svg)](https://www.npmjs.com/package/persian-number-input)
[![دانلودهای npm](https://img.shields.io/npm/dm/persian-number-input.svg)](https://www.npmjs.com/package/persian-number-input)
[![حجم باندل](https://img.shields.io/bundlephobia/minzip/persian-number-input)](https://bundlephobia.com/package/persian-number-input)
[![مجوز](https://img.shields.io/npm/l/persian-number-input.svg)](https://github.com/javadSharifi/persian-number-input/blob/main/LICENSE)

## 🚀 [دموی آنلاین](https://persian-number-input.netlify.app/)

---

## چرا این پکیج؟

ساختن فرم برای کاربران فارسی‌زبان چالش‌های واقعی داره:

- کاربر `۱۲۳۴` تایپ می‌کنه — API شما `1234` می‌خواد
- `<input type="number">` اصلاً ارقام فارسی یا عربی رو قبول نمی‌کنه
- وقتی جداکننده هزارگان اضافه میشه، cursor جهش می‌کنه
- جداکننده اعشاری در فارسی `٫` هست نه `.`
- ورودی‌های RTL نیاز به تنظیمات خاص دارن

این پکیج همه اینا رو خودکار حل می‌کنه:

```
کاربر تایپ می‌کند:  ۱۲۳۴۵۶۷
نمایش داده می‌شود: ۱,۲۳۴,۵۶۷
فرم دریافت می‌کند: "1234567"
```

---

## ✨ امکانات

- 🔢 **تبدیل خودکار ارقام** — فارسی (۰-۹) و عربی (٠-٩) به انگلیسی و برعکس
- 🌍 **چند زبانه** — فارسی (`fa`)، عربی (`ar`)، انگلیسی (`en`)
- 📊 **جداکننده هزارگان** — قابل تنظیم با هر کاراکتری
- 💰 **آماده برای ارز** — پشتیبانی از پسوند (تومان، ریال، ر.س) و جداکننده اعشاری سفارشی
- ⚡ **فقط ~۱ کیلوبایت** — بدون هیچ dependency اضافه
- 🎯 **TypeScript** — تعریف تایپ کامل
- 🔄 **حفظ موقعیت cursor** — بدون جهش هنگام فرمت‌دهی
- 📋 **مدیریت هوشمند paste** — محتوای چسبانده شده خودکار پالایش و تبدیل می‌شود
- ✅ **اعتبارسنجی min/max** — اعتبارسنجی نرم با `aria-invalid` و اعمال خودکار محدودیت در blur
- ♿ **دسترس‌پذیر** — رعایت استانداردهای WCAG

---

## 📦 نصب

```bash
npm install persian-number-input
# یا
yarn add persian-number-input
# یا
pnpm add persian-number-input
```

> **نیازمندی‌ها:** React 16.8 به بالا — سازگار با Next.js، Vite، و CRA.

---

## 🎯 شروع سریع

```tsx
import { PersianNumberInput } from "persian-number-input";

function App() {
  return (
    <PersianNumberInput
      initialValue={1234567}
      locale="fa"
      onValueChange={(value) => console.log(value)} // "1234567"
    />
  );
}
```

خروجی نمایشی: `۱,۲۳۴,۵۶۷`

---

## 📚 مثال‌های کاربردی

### ورودی مبلغ تومان

```tsx
<PersianNumberInput
  initialValue={5000000}
  locale="fa"
  suffix="تومان"
  separatorCount={3}
  separatorChar=","
  onValueChange={(value) => console.log(value)}
/>
```

خروجی: `۵,۰۰۰,۰۰۰ تومان`

---

### ورودی ریال با اعتبارسنجی

```tsx
<PersianNumberInput
  initialValue={0}
  locale="fa"
  min={0}
  max={999999999}
  suffix="ریال"
  showZero={true}
  onValueChange={(value) => console.log(value)}
/>
```

---

### عدد اعشاری با جداکننده فارسی

```tsx
<PersianNumberInput
  initialValue={1234.56}
  locale="fa"
  maxDecimals={2}
  decimalChar="٫"
  separatorChar=","
  onValueChange={(value) => console.log(value)}
/>
```

خروجی: `۱,۲۳۴٫۵۶`

---

### زبان عربی (ریال سعودی)

```tsx
<PersianNumberInput
  initialValue={987654}
  locale="ar"
  separatorChar=","
  suffix="ر.س"
  onValueChange={(value) => console.log(value)}
/>
```

خروجی: `٩٨٧,٦٥٤ ر.س`

---

### استفاده با React Hook Form

```tsx
import { useForm, Controller } from "react-hook-form";
import { PersianNumberInput } from "persian-number-input";

function ProductForm() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <Controller
        name="price"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <PersianNumberInput
            locale="fa"
            suffix="تومان"
            onValueChange={field.onChange}
            initialValue={field.value}
          />
        )}
      />
      <button type="submit">ثبت</button>
    </form>
  );
}
```

---

### استفاده از Hook (پیشرفته)

```tsx
import { usePersianNumberInput } from "persian-number-input";

function CustomInput() {
  const { value, onChange, onBlur, rawValue } = usePersianNumberInput({
    initialValue: 1000,
    locale: "fa",
    separatorCount: 3,
    maxDecimals: 2,
    min: 0,
    max: 1000000,
    onValueChange: (val) => console.log("مقدار انگلیسی:", val),
  });

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onPaste={onPaste}
      dir="rtl"
    />
  );
}
```

Hook همچنین `isInvalid` (boolean) رو وقتی مقدار از `max` بیشتر بشه برمی‌گردونه، و `onPaste` برای مدیریت رویداد paste.

---

### ماشین‌حساب وام

```tsx
import { useState } from "react";
import { PersianNumberInput } from "persian-number-input";

function LoanCalculator() {
  const [principal, setPrincipal] = useState<string>();
  const [rate, setRate] = useState<string>();
  const [years, setYears] = useState<string>();

  const calculateMonthlyPayment = () => {
    if (!principal || !rate || !years) return 0;
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12;
    return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  return (
    <div className="space-y-4">
      <div>
        <label>مبلغ وام:</label>
        <PersianNumberInput locale="fa" suffix="تومان" onValueChange={setPrincipal} min={0} />
      </div>
      <div>
        <label>نرخ سود (٪):</label>
        <PersianNumberInput locale="fa" maxDecimals={2} onValueChange={setRate} min={0} max={100} />
      </div>
      <div>
        <label>مدت زمان (سال):</label>
        <PersianNumberInput locale="fa" onValueChange={setYears} min={1} max={30} />
      </div>
      <p>پرداخت ماهیانه: {calculateMonthlyPayment().toLocaleString("fa-IR")} تومان</p>
    </div>
  );
}
```

---

## 🛠️ مرجع API

### Props کامپوننت `PersianNumberInput`

| ویژگی            | نوع                                    | پیش‌فرض     | توضیحات                                                          |
| ---------------- | -------------------------------------- | ----------- | ---------------------------------------------------------------- |
| `initialValue`   | `number \| string`                     | `undefined` | مقدار اولیه ورودی                                                |
| `locale`         | `"fa" \| "ar" \| "en"`                 | `"fa"`      | زبان — فارسی، عربی یا انگلیسی                                   |
| `separatorCount` | `number`                               | `3`         | تعداد ارقام بین جداکننده‌ها (۳ = هزارگان)                       |
| `separatorChar`  | `string`                               | `","`       | کاراکتر جداکننده هزارگان                                         |
| `decimalChar`    | `string`                               | خودکار      | جداکننده اعشار (`٫` برای fa، `.` برای en)                       |
| `suffix`         | `string`                               | `undefined` | پسوند — مثل `تومان`، `ریال`                                     |
| `maxDecimals`    | `number`                               | `undefined` | حداکثر رقم اعشار مجاز                                            |
| `min`            | `number`                               | `undefined` | کمترین مقدار مجاز                                                |
| `max`            | `number`                               | `undefined` | بیشترین مقدار مجاز — اعتبارسنجی نرم (علامت‌گذاری invalid، اعمال در blur) |
| `showZero`       | `boolean`                              | `false`     | نمایش صفر وقتی ورودی خالی است                                    |
| `onValueChange`  | `(value: string \| undefined) => void` | `undefined` | callback هنگام تغییر — همیشه ارقام انگلیسی برمی‌گرداند          |

تمام props استاندارد `<input>` مثل `onChange`، `onKeyDown`، `onPaste`، `className`، `style`، `placeholder`، `dir` و `disabled` هم پشتیبانی می‌شن.

---

### توابع کمکی

#### `transformNumber(rawValue, options)`

فرمت‌دهی یک رشته عددی بر اساس زبان و تنظیمات:

```tsx
import { transformNumber } from "persian-number-input";

transformNumber("1234567.89", {
  locale: "fa",
  separatorCount: 3,
  separatorChar: ",",
  maxDecimals: 2,
  suffix: "تومان",
});
// ← "۱,۲۳۴,۵۶۷٫۸۹ تومان"
```

#### `toEnglishDigits(str, decimalChar?)`

تبدیل ارقام فارسی یا عربی به انگلیسی:

```tsx
import { toEnglishDigits } from "persian-number-input";

toEnglishDigits("۱۲۳۴"); // "1234"
toEnglishDigits("٩٨٧٦"); // "9876"
```

#### `toLocalizedDigits(numStr, locale)`

تبدیل ارقام انگلیسی به زبان مقصد:

```tsx
import { toLocalizedDigits } from "persian-number-input";

toLocalizedDigits("1234", "fa"); // "۱۲۳۴"
toLocalizedDigits("5678", "ar"); // "٥٦٧٨"
```

#### `sanitizeNumericInput(value, maxDecimals?, decimalChar?)`

پاکسازی ورودی و اعمال محدودیت اعشار:

```tsx
import { sanitizeNumericInput } from "persian-number-input";

sanitizeNumericInput("۱۲۳abc۴۵۶", 2); // "123456"
sanitizeNumericInput("12.345.67", 2);  // "12.34"
```

#### `stripNonNumeric(str)`

حذف همه کاراکترهای غیرعددی و غیر از نقطه:

```tsx
import { stripNonNumeric } from "persian-number-input";

stripNonNumeric("12abc34.56xyz"); // "1234.56"
```

#### `normalizeDecimals(str)`

نگه داشتن فقط اولین نقطه اعشاری:

```tsx
import { normalizeDecimals } from "persian-number-input";

normalizeDecimals("12.34.56"); // "12.3456"
```

#### `stripLeadingZeros(str)`

حذف صفرهای اضافه ابتدای عدد:

```tsx
import { stripLeadingZeros } from "persian-number-input";

stripLeadingZeros("001234.56"); // "1234.56"
```

#### `applyDecimalPrecision(str, maxDecimals?)`

محدود کردن قسمت اعشار به تعداد رقم مشخص:

```tsx
import { applyDecimalPrecision } from "persian-number-input";

applyDecimalPrecision("1234.5678", 2); // "1234.56"
```

#### `roundToDecimals(value, maxDecimals?)`

مشابه `applyDecimalPrecision` — محدود کردن قسمت اعشار:

```tsx
import { roundToDecimals } from "persian-number-input";

roundToDecimals("1234.5678", 2); // "1234.56"
```

---

## 🎨 استایل‌دهی

```tsx
<PersianNumberInput
  locale="fa"
  className="w-full px-4 py-3 text-lg border-2 border-indigo-500 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-600"
/>
```

برای چیدمان RTL، `dir="rtl"` رو روی wrapper بذارید یا `style={{ textAlign: "right" }}` رو مستقیم پاس بدید.

---

## ❓ سوالات متداول

**آیا با Next.js و App Router کار می‌کنه؟**
بله. چون کامپوننت client-side هست، `"use client"` رو بالای فایلت بذار.

**مقدار برگشتی `onValueChange` چیه؟**
همیشه رشته‌ای از ارقام انگلیسی — مثلاً `"1234567"` — صرف‌نظر از اینکه چه locale‌ای نمایش داده میشه.

**آیا با `input` داخل یک فرم native کار می‌کنه؟**
از `onValueChange` برای ذخیره مقدار در state استفاده کن، بعد موقع submit از state بخون. یا از React Hook Form با Controller استفاده کن (مثال بالا).

**تفاوت `locale="fa"` و `locale="ar"` چیه؟**
`fa` از ارقام فارسی (۰–۹) و جداکننده `٫` استفاده می‌کنه. `ar` از ارقام عربی شرقی (٠–٩). هر دو مقدار انگلیسی به `onValueChange` برمی‌گردونن.

**آیا محدودیت عددی وجود داره؟**
نه. پکیج از مقایسه عددی مبتنی بر رشته استفاده می‌کنه و اعداد خیلی بزرگ یا با دقت اعشاری بالا رو بدون خطای floating-point پردازش می‌کنه.

---

## 🏆 مقایسه با بقیه

| امکانات                        | persian-number-input | `<input>` معمولی | کتابخانه‌های دیگر |
| ------------------------------ | :------------------: | :--------------: | :---------------: |
| ورودی ارقام فارسی و عربی       | ✅                   | ❌               | ⚠️ ناقص           |
| حفظ موقعیت cursor هنگام فرمت  | ✅                   | ❌               | ⚠️ اغلب باگ‌دار   |
| چند locale (fa / ar / en)     | ✅                   | ❌               | ❌                |
| جداکننده هزارگان               | ✅                   | ❌               | ⚠️ محدود          |
| کنترل دقت اعشاری               | ✅                   | ❌               | ⚠️ محدود          |
| اعتبارسنجی min/max             | ✅                   | جزئی             | ⚠️ متغیر          |
| TypeScript                     | ✅                   | ✅               | ⚠️ متغیر          |
| حجم باندل                      | 🟢 ~۱ کیلوبایت      | 🟢 native        | 🔴 ۵–۳۰ کیلوبایت  |

---

## 🤝 مشارکت در توسعه

خوشحال میشم مشارکت کنید!

1. مخزن رو Fork کنید
2. شاخه feature بسازید: `git checkout -b feature/your-feature`
3. تغییرات رو commit کنید: `git commit -m 'Add your feature'`
4. push کنید: `git push origin feature/your-feature`
5. Pull Request باز کنید

برای تغییرات بزرگ، لطفاً اول یه issue باز کنید تا با هم بررسی کنیم.

---

## 📄 مجوز

MIT © [Javad Sharifi](https://github.com/javadSharifi)

---

## 📞 پشتیبانی

- 💬 تلگرام: [@Javad_sharifi98](https://t.me/Javad_sharifi98)
- 🐛 [گزارش مشکل](https://github.com/javadSharifi/persian-number-input/issues)
- 💬 [بحث و گفتگو](https://github.com/javadSharifi/persian-number-input/discussions)

---

**ساخته شده با ❤️ برای جامعه توسعه‌دهندگان فارسی و عربی‌زبان**

<!-- کلیدواژه‌ها: ورودی عدد فارسی ریکت، تبدیل اعداد فارسی به انگلیسی، کامپوننت ورودی فارسی، ورودی RTL، جداکننده هزارگان فارسی، ورودی اعداد عربی، persian number input react، farsi digit input، arabic number react -->
