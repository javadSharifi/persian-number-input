# ورودی اعداد فارسی و عربی

یک کتابخانه React سبک و قدرتمند برای مدیریت ورودی اعداد فارسی و عربی با تبدیل خودکار ارقام، فرمت‌دهی و پشتیبانی از چند زبان.

[![نسخه npm](https://img.shields.io/npm/v/persian-number-input.svg)](https://www.npmjs.com/package/persian-number-input)
[![دانلودهای npm](https://img.shields.io/npm/dm/persian-number-input.svg)](https://www.npmjs.com/package/persian-number-input)
[![حجم باندل](https://img.shields.io/bundlephobia/minzip/persian-number-input)](https://bundlephobia.com/package/persian-number-input)
[![مجوز](https://img.shields.io/npm/l/persian-number-input.svg)](https://github.com/javadSharifi/persian-number-input/blob/main/LICENSE)

## 🚀 [دموی آنلاین](https://persian-number-input.netlify.app/)

کامپوننت را به صورت زنده تجربه کنید!

---

## 📊 حجم باندل

این کتابخانه فوق‌العاده سبک است:

```
persian-number-input: تنها ~1KB (فشرده شده)
```

![مقایسه حجم باندل](./public/size.png)

---

## ✨ امکانات

- 🔢 **تبدیل خودکار ارقام** - تبدیل یکپارچه ارقام فارسی (۰-۹) و عربی (٠-٩) به انگلیسی و بالعکس
- 🌍 **پشتیبانی چندزبانه** - پشتیبانی داخلی از فارسی (fa)، عربی (ar) و انگلیسی (en)
- 📊 **فرمت‌دهی اعداد** - جداکننده هزارگان خودکار با کاراکترهای قابل تنظیم
- 💰 **آماده برای ارز** - امکان افزودن پیشوند، پسوند و جداکننده اعشاری سفارشی
- ⚡ **سبک و سریع** - حجم بسیار کم با صفر وابستگی (به جز decimal.js برای دقت)
- 🎯 **Type-Safe** - پشتیبانی کامل TypeScript با تعاریف تایپ کامل
- ♿ **قابل دسترس** - پیروی از بهترین شیوه‌های دسترسی‌پذیری
- 🎨 **قابل سفارشی‌سازی** - گزینه‌های پیکربندی گسترده برای هر نیازی
- 🔄 **فرمت‌دهی لحظه‌ای** - فرمت کردن اعداد همزمان با تایپ کاربر با حفظ موقعیت مکان‌نما
- ✅ **اعتبارسنجی** - کنترل داخلی مقادیر min/max و دقت اعشاری

---

## 📦 نصب

```bash
npm install persian-number-input
```

```bash
yarn add persian-number-input
```

```bash
pnpm add persian-number-input
```

---

## 🎯 شروع سریع

### استفاده ساده

```tsx
import { PersianNumberInput } from "persian-number-input";

function App() {
  return (
    <PersianNumberInput
      initialValue={1234567}
      locale="fa"
      onValueChange={(value) => console.log(value)}
    />
  );
}
```

**خروجی:** `۱,۲۳۴,۵۶۷`

---

## 📚 نمونه‌های کاربردی

### ورودی مبلغ (تومان ایران)

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

**خروجی:** `۵,۰۰۰,۰۰۰ تومان`

---

### اعداد اعشاری با جداکننده سفارشی

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

**خروجی:** `۱,۲۳۴٫۵۶`

---

### ورودی قیمت با اعتبارسنجی

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

**خروجی:** `۰ ریال`

---

### زبان عربی

```tsx
<PersianNumberInput
  initialValue={987654}
  locale="ar"
  separatorChar=","
  suffix="ر.س"
  onValueChange={(value) => console.log(value)}
/>
```

**خروجی:** `٩٨٧,٦٥٤ ر.س`

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
    onValueChange: (val) => {
      console.log("مقدار خام:", val); // "1000"
      console.log("مقدار نمایشی:", value); // "۱,۰۰۰"
    },
  });

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className="custom-input"
    />
  );
}
```

---

## 🛠️ مرجع API

### Props کامپوننت PersianNumberInput

| ویژگی            | نوع                                    | پیش‌فرض     | توضیحات                                                         |
| ---------------- | -------------------------------------- | ----------- | --------------------------------------------------------------- |
| `initialValue`   | `number \| string`                     | `undefined` | مقدار اولیه ورودی                                               |
| `locale`         | `"fa" \| "ar" \| "en"`                 | `"fa"`      | زبان برای تبدیل ارقام                                           |
| `separatorCount` | `number`                               | `3`         | تعداد ارقام بین جداکننده‌ها                                     |
| `separatorChar`  | `string`                               | `","`       | کاراکتر جداکننده هزارگان                                        |
| `decimalChar`    | `string`                               | خودکار      | کاراکتر جداکننده اعشار                                          |
| `suffix`         | `string`                               | `undefined` | متن پسوند (مثل واحد پول)                                        |
| `maxDecimals`    | `number`                               | `undefined` | حداکثر رقم اعشار مجاز                                           |
| `min`            | `number`                               | `undefined` | کمترین مقدار مجاز                                               |
| `max`            | `number`                               | `undefined` | بیشترین مقدار مجاز                                              |
| `showZero`       | `boolean`                              | `false`     | نمایش صفر وقتی مقدار خالی است                                   |
| `onValueChange`  | `(value: string \| undefined) => void` | `undefined` | تابع فراخوانی هنگام تغییر مقدار (ارقام انگلیسی خام برمی‌گرداند) |

تمام props استاندارد HTML input نیز پشتیبانی می‌شوند.

---

### توابع کمکی

#### `transformNumber(rawValue, options)`

یک رشته عددی را بر اساس زبان و تنظیمات فرمت می‌کند.

```tsx
import { transformNumber } from "persian-number-input";

const formatted = transformNumber("1234567.89", {
  locale: "fa",
  separatorCount: 3,
  separatorChar: ",",
  maxDecimals: 2,
  suffix: "تومان",
});

console.log(formatted); // "۱,۲۳۴,۵۶۷٫۸۹ تومان"
```

#### `toEnglishDigits(str, decimalChar?)`

ارقام فارسی/عربی را به انگلیسی تبدیل می‌کند.

```tsx
import { toEnglishDigits } from "persian-number-input";

console.log(toEnglishDigits("۱۲۳۴")); // "1234"
console.log(toEnglishDigits("٩٨٧٦")); // "9876"
```

#### `toLocalizedDigits(numStr, locale)`

ارقام انگلیسی را به ارقام محلی تبدیل می‌کند.

```tsx
import { toLocalizedDigits } from "persian-number-input";

console.log(toLocalizedDigits("1234", "fa")); // "۱۲۳۴"
console.log(toLocalizedDigits("5678", "ar")); // "٥٦٧٨"
```

#### `sanitizeNumericInput(value, maxDecimals?, decimalChar?)`

ورودی عددی را پاکسازی و اعتبارسنجی می‌کند.

```tsx
import { sanitizeNumericInput } from "persian-number-input";

console.log(sanitizeNumericInput("۱۲۳abc۴۵۶", 2)); // "123456"
console.log(sanitizeNumericInput("12.345.67", 2)); // "12.34"
```

---

## 🎨 استایل‌دهی

کامپوننت تمام props استاندارد input را می‌پذیرد، از جمله `className` و `style`:

```tsx
<PersianNumberInput
  initialValue={1000}
  locale="fa"
  className="custom-input"
  style={{
    padding: "12px",
    fontSize: "16px",
    border: "2px solid #4F46E5",
    borderRadius: "8px",
    textAlign: "right",
  }}
/>
```

### با Tailwind CSS

```tsx
<PersianNumberInput
  initialValue={1000}
  locale="fa"
  className="w-full px-4 py-3 text-lg border-2 border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-right"
/>
```

---

## 🌟 مثال‌های پیشرفته

### ماشین حساب مالی

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
        <PersianNumberInput
          locale="fa"
          suffix="تومان"
          onValueChange={setPrincipal}
          min={0}
        />
      </div>
      <div>
        <label>نرخ سود (٪):</label>
        <PersianNumberInput
          locale="fa"
          maxDecimals={2}
          onValueChange={setRate}
          min={0}
          max={100}
        />
      </div>
      <div>
        <label>مدت زمان (سال):</label>
        <PersianNumberInput
          locale="fa"
          onValueChange={setYears}
          min={1}
          max={30}
        />
      </div>
      <p>
        پرداخت ماهیانه: {calculateMonthlyPayment().toLocaleString("fa-IR")}{" "}
        تومان
      </p>
    </div>
  );
}
```

---

### یکپارچگی با فرم

```tsx
import { useForm, Controller } from "react-hook-form";
import { PersianNumberInput } from "persian-number-input";

function ProductForm() {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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

## 🔍 چرا ورودی اعداد فارسی؟

### مشکل

کار با ارقام فارسی و عربی در برنامه‌های وب چالش‌برانگیز است:

- کاربران با ارقام بومی خود تایپ می‌کنند، اما فرم‌ها ارقام انگلیسی انتظار دارند
- فرمت‌دهی اعداد در زبان‌های مختلف متفاوت است
- حفظ موقعیت مکان‌نما هنگام فرمت‌دهی پیچیده است
- مدیریت دقت اعشاری نیاز به پیاده‌سازی دقیق دارد

### راه‌حل

ورودی اعداد فارسی تمام این پیچیدگی‌ها را به صورت خودکار مدیریت می‌کند:

```tsx
// کاربر تایپ می‌کند: ۱۲۳۴۵۶۷
// کامپوننت نمایش می‌دهد: ۱,۲۳۴,۵۶۷
// فرم دریافت می‌کند: "1234567"
```

---

## 🏆 مقایسه

| امکانات             | ورودی اعداد فارسی | Input معمولی | کتابخانه‌های دیگر |
| ------------------- | ----------------- | ------------ | ----------------- |
| تبدیل خودکار ارقام  | ✅                | ❌           | ⚠️ جزئی           |
| حفظ مکان‌نما        | ✅                | ❌           | ⚠️ باگ‌دار        |
| پشتیبانی TypeScript | ✅                | ✅           | ⚠️ متغیر          |
| چند زبانه           | ✅                | ❌           | ❌                |
| حجم باندل           | 🟢 کم             | 🟢 -         | 🔴 زیاد           |
| دقت اعشاری          | ✅                | ❌           | ⚠️ محدود          |

---

## 🤝 مشارکت

مشارکت شما استقبال می‌شود! لطفاً از ارسال Pull Request دریغ نکنید.

1. مخزن را Fork کنید
2. شاخه ویژگی خود را ایجاد کنید (`git checkout -b feature/AmazingFeature`)
3. تغییرات خود را Commit کنید (`git commit -m 'Add some AmazingFeature'`)
4. به شاخه Push کنید (`git push origin feature/AmazingFeature`)
5. یک Pull Request باز کنید

---

## 📄 مجوز

MIT © javad Sharifi

---

## 🙏 تشکرات

- ساخته شده با TypeScript و React
- استفاده از [decimal.js](https://github.com/MikeMcl/decimal.js/) برای محاسبات دقیق اعشاری
- الهام‌گرفته از نیازهای توسعه‌دهندگان فارسی و عربی‌زبان

---

## 📞 پشتیبانی

- 📧 telegram: [Javad Sharifi](https://t.me/Javad_sharifi98)
- 🐛 [گزارش مشکلات](https://github.com/javadSharifi/persian-number-input/issues)
- 💬 [بحث و گفتگو](https://github.com/javadSharifi/persian-number-input/discussions)

**ساخته شده با ❤️ برای جامعه توسعه‌دهندگان فارسی و عربی‌زبان**
