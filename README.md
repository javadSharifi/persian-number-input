# Persian Number Input

🌟 **React Persian Number Input Component**

---

English 🇺🇸 | فارسی 🇮🇷

---

## English

**Persian Number Input** - A powerful React component and utility for formatting and handling numbers in Persian, English, or other localized digit systems. Perfect for multilingual applications requiring numeric inputs with customizable formatting, including decimal support.

✅ **Key Features:**

- Supports Persian, English, and other digit localization (e.g., Indic)
- Customizable digit grouping (e.g., thousands separator)
- Handles decimal numbers with configurable precision using ``
- Min/max value constraints for input validation, including decimals
- Converts localized digits to standard English digits for processing
- Lightweight and compatible with React 16 to 19
- TypeScript support for robust development

### 🚀 Installation

Install the package via npm or yarn:

```bash
npm install persian-number-input 
```

### 💻 Usage Examples

#### 1. Using `PersianNumberInput` Component

This component is ideal for form inputs requiring localized number formatting.

```jsx
import React, { useState } from "react";
import { PersianNumberInput } from "persian-number-input";

const App = () => {
  const [number, setNumber] = useState("");

  return (
    <PersianNumberInput
      initialValue="123456.78"
      separatorCount={3}
      separatorChar=","
      locale="fa"
      maxDecimals={2}
      min={0.5}
      max={1000000.999}
      showZero={true}
      onValueChange={(val) => setNumber(val || "")}
      placeholder="Enter a number"
      className="numeric-input"
    />
  );
};

export default App;
```

**Output**:
```
Input: 123456.78
Displayed Output: ۱۲۳,۴۵۶٫۷۸
English Output: 123456.78
```

#### 2. Using `usePersianNumberInput` Hook

The `usePersianNumberInput` hook provides fine-grained control for custom input handling.

```jsx
import React from "react";
import { usePersianNumberInput } from "persian-number-input";

const CustomInput = () => {
  const { value, onChange, rawValue } = usePersianNumberInput({
    initialValue: "5000.25",
    separatorCount: 3,
    separatorChar: ",",
    locale: "fa",
    maxDecimals: 2,
    min: 0.5,
    max: 10000.999,
    showZero: true,
  });

  return (
    <div>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={onChange}
        placeholder="Enter a number"
      />
      <p>Raw Value: {rawValue || "N/A"}</p>
    </div>
  );
};

export default CustomInput;
```

**Explanation**:
- The hook manages the input state and formatting, returning `value` (formatted for display) and `rawValue` (English digits).
- Use this for custom input components or non-standard form controls.
- **Output**:
  ```
  Displayed Input:ავ۰٫۲۵
  Raw Value: 5000.25
  ```

#### 3. Using `transformNumber` Utility

The `transformNumber` function formats numbers without requiring a React component, ideal for display-only scenarios.

```javascript
import { transformNumber } from "persian-number-input";

const number = 123456.789;
const formatted = transformNumber(number, {
  separatorCount: 3,
  separatorChar: ",",
  locale: "fa",
  maxDecimals: 2,
  showZero: true,
});

console.log(formatted); // Output: ۱۲۳,۴۵۶٫۷۹
```

**Explanation**:
- Use `transformNumber` to format numbers for display in tables, labels, or other non-input contexts.
- Supports the same options as `PersianNumberInput` (`separatorCount`, `locale`, etc.).
- Returns a string with localized digits and formatting.

### 📚 Props Reference

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `initialValue` | `string | number` | `""` | Initial value of the input |
| `separatorCount` | `number` | `3` | Number of digits per group (e.g., 3 for thousands) |
| `separatorChar` | `string` | `","` | Character used for grouping digits (e.g., `,` or `.`) |
| `locale` | `string` | `"fa"` | Language for digit localization (e.g., `fa`, `en`) |
| `maxDecimals` | `number` | `0` | Maximum number of decimal places allowed |
| `showZero` | `boolean` | `false` | If `true`, displays `0` when the input is empty or zero |
| `min` | `number` | - | Minimum allowed value (supports decimals, e.g., `0.5`) |
| `max` | `number` | - | Maximum allowed value (supports decimals, e.g., `1000.201`) |
| `onValueChange` | `(value: string | undefined) => void` | - | Callback for value changes |
| `...rest` | `InputHTMLAttributes` | - | Standard HTML input attributes (e.g., `className`, `placeholder`, `style`) |

### 🌟 Why Use Persian Number Input?

- **Multilingual Support**: Seamlessly handle Persian, English, or other localized digits.
- **Customizable Formatting**: Control separators, decimals, and zero display.
- **Robust Validation**: Enforce min/max constraints with decimal precision using ``.
- **Developer-Friendly**: TypeScript support and a simple API for quick integration.
- **Lightweight**: Optimized for performance with minimal dependencies.

### ❓ FAQ (Frequently Asked Questions)

**Does this package support React 19?**  
Yes, it is fully compatible with React 16 through 19.

**Can I use decimal numbers?**  
Yes, set `maxDecimals` to the desired number of decimal places (e.g., `maxDecimals={2}`).

**How do I enforce minimum and maximum values?**  
Use the `min` and `max` props, which support decimals (e.g., `min={0.5}`, `max={1000.201}`).

**How can I style the input?**  
Pass `className` or `style` props to customize the input’s appearance.

**What happens if the user enters an invalid number?**  
The component sanitizes inputs, ensuring only valid numbers are processed, and respects min/max constraints.

### 🌟 Support the Project

If you find this package useful, **please give it a star ⭐ on GitHub** to support further development.

👉 **[GitHub Repository](https://github.com/javadSharifi/persian-number-input)**

Thank you for your support! ❤️🚀

### 📈 SEO Keywords

`Persian Number Input`, `React Persian input`, `React number formatting`, `localized numeric input`, `Persian digits`, `React numeric input`, `number formatter`, `TypeScript React component`, `multilingual input`, `React number formatting hook`, `Persian number utility`

### 📄 License

MIT License

© 2025 Javad Sharifi. All rights reserved.

---

## فارسی

**کامپوننت ورودی اعداد فارسی** - یک کامپوننت و ابزار قدرتمند React برای مدیریت و فرمت‌بندی اعداد به صورت فارسی، انگلیسی یا سایر سیستم‌های ارقام محلی. ایده‌آل برای برنامه‌های چندزبانه که نیاز به ورودی‌های عددی با فرمت سفارشی و پشتیبانی از اعشار دارند.

✅ **امکانات کلیدی:**

- پشتیبانی از ارقام فارسی، انگلیسی و سایر زبان‌ها (مانند هندی)
- قابلیت تنظیم جداکننده ارقام (مثل هزارگان)

- اعمال محدودیت‌های حداقل و حداکثر با پشتیبانی از اعشار
- تبدیل خودکار ارقام محلی به ارقام انگلیسی برای پردازش
- سبک و سازگار با React 16 تا 19
- پشتیبانی از TypeScript برای توسعه امن

### 🚀 نصب

پکیج را از طریق npm یا yarn نصب کنید:

```bash
npm install persian-number-input 
```

### 💻 مثال‌های استفاده

#### ۱. استفاده از کامپوننت `PersianNumberInput`

این کامپوننت برای ورودی‌های فرم با فرمت‌بندی محلی مناسب است.

```jsx
import React, { useState } from "react";
import { PersianNumberInput } from "persian-number-input";

const App = () => {
  const [number, setNumber] = useState("");

  return (
    <PersianNumberInput
      initialValue="123456.78"
      separatorCount={3}
      separatorChar=","
      locale="fa"
      maxDecimals={2}
      min={0.5}
      max={1000000.999}
      showZero={true}
      onValueChange={(val) => setNumber(val || "")}
      placeholder="یک عدد وارد کنید"
      className="numeric-input"
    />
  );
};

export default App;
```

**خروجی**:
```
ورودی: 123456.78
خروجی نمایشی: ۱۲۳,۴۵۶٫۷۸
خروجی انگلیسی: 123456.78
```

#### ۲. استفاده از هوک `usePersianNumberInput`

هوک `usePersianNumberInput` برای کنترل دقیق ورودی‌های سفارشی استفاده می‌شود.

```jsx
import React from "react";
import { usePersianNumberInput } from "persian-number-input";

const CustomInput = () => {
  const { value, onChange, rawValue } = usePersianNumberInput({
    initialValue: "5000.25",
    separatorCount: 3,
    separatorChar: ",",
    locale: "fa",
    maxDecimals: 2,
    min: 0.5,
    max: 10000.999,
    showZero: true,
  });

  return (
    <div>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={onChange}
        placeholder="یک عدد وارد کنید"
      />
      <p>مقدار خام: {rawValue || "بدون مقدار"}</p>
    </div>
  );
};

export default CustomInput;
```

**توضیح**:
- این هوک وضعیت ورودی و فرمت‌بندی را مدیریت می‌کند و `value` (برای نمایش) و `rawValue` (ارقام انگلیسی) را برمی‌گرداند.
- برای کامپوننت‌های ورودی سفارشی یا فرم‌های غیراستاندارد مناسب است.
- **خروجی**:
  ```
  ورودی نمایشی: ۵,۰۰۰٫۲۵
  مقدار خام: 5000.25
  ```

#### ۳. استفاده از ابزار `transformNumber`

تابع `transformNumber` برای فرمت‌بندی اعداد بدون نیاز به کامپوننت React مناسب است.

```javascript
import { transformNumber } from "persian-number-input";

const number = 123456.789;
const formatted = transformNumber(number, {
  separatorCount: 3,
  separatorChar: ",",
  locale: "fa",
  maxDecimals: 2,
  showZero: true,
});

console.log(formatted); // خروجی: ۱۲۳,۴۵۶٫۷۹
```

**توضیح**:
- از `transformNumber` برای فرمت‌بندی اعداد در جداول، برچسب‌ها یا سایر موارد غیرورودی استفاده کنید.
- همان گزینه‌های `PersianNumberInput` (مانند `separatorCount` و `locale`) را پشتیبانی می‌کند.
- یک رشته با ارقام محلی و فرمت‌بندی مناسب برمی‌گرداند.

### 📚 مرجع مشخصات (Props)

| نام | نوع | پیش‌فرض | توضیح |
| --- | --- | --- | --- |
| `initialValue` | `string | number` | `""` | مقدار اولیه ورودی |
| `separatorCount` | `number` | `3` | تعداد ارقام در هر گروه (مثلاً ۳ برای هزارگان) |
| `separatorChar` | `string` | `","` | کاراکتر جداکننده گروه‌ها (مثلاً `,` یا `.`) |
| `locale` | `string` | `"fa"` | زبان برای محلی‌سازی ارقام (مثلاً `fa` یا `en`) |
| `maxDecimals` | `number` | `0` | حداکثر تعداد ارقام اعشاری مجاز |
| `showZero` | `boolean` | `false` | اگر `true` باشد، عدد `0` را در ورودی خالی یا صفر نمایش می‌دهد |
| `min` | `number` | - | حداقل مقدار مجاز (پشتیبانی از اعشار، مثلاً `0.5`) |
| `max` | `number` | - | حداکثر مقدار مجاز (پشتیبانی از اعشار، مثلاً `1000.201`) |
| `onValueChange` | `(value: string | undefined) => void` | - | فراخوانی در تغییر مقدار |
| `...rest` | `InputHTMLAttributes` | - | ویژگی‌های استاندارد ورودی HTML (مثل `className`، `placeholder`، `style`) |

### 🌟 چرا از این کامپوننت استفاده کنیم؟

- **پشتیبانی چندزبانه**: مدیریت آسان ارقام فارسی، انگلیسی یا سایر زبان‌ها.
- **فرمت‌بندی انعطاف‌پذیر**: کنترل جداکننده‌ها، اعشار و نمایش صفر.
- **اعتبارسنجی قوی**: اعمال محدودیت‌های حداقل و حداکثر با دقت اعشاری با ``.
- **مناسب توسعه‌دهندگان**: پشتیبانی از TypeScript و API ساده برای ادغام سریع.
- **سبک و سریع**: بهینه‌شده برای عملکرد با حداقل وابستگی‌ها.

### ❓ سوالات متداول

**آیا این پکیج از React 19 پشتیبانی می‌کند؟**  
بله، کاملاً با React 16 تا 19 سازگار است.

**آیا می‌توان از اعداد اعشاری استفاده کرد؟**  
بله، با تنظیم `maxDecimals` می‌توانید تعداد ارقام اعشاری را مشخص کنید (مثلاً `maxDecimals={2}`).

**چگونه می‌توان حداقل و حداکثر مقدار را اعمال کرد؟**  
از پراپ‌های `min` و `max` استفاده کنید که از اعشار پشتیبانی می‌کنند (مثلاً `min={0.5}` و `max={1000.201}`).

**چگونه ظاهر ورودی را سفارشی کنم؟**  
با پراپ‌های `className` یا `style` می‌توانید ظاهر ورودی را تغییر دهید.

**اگر کاربر عدد نامعتبری وارد کند چه می‌شود؟**  
کامپوننت ورودی‌ها را پاکسازی می‌کند و فقط اعداد معتبر را پردازش می‌کند، ضمن رعایت محدودیت‌های min/max.

### 🌟 حمایت از پروژه

اگر این پکیج برای شما مفید بود، **لطفاً یک ستاره ⭐ به مخزن GitHub بدهید** تا توسعه بیشتر آن را تشویق کنید.

👉 **[مخزن GitHub](https://github.com/javadSharifi/persian-number-input)**

از حمایت شما سپاسگزاریم! ❤️🚀

### 📈 کلمات کلیدی برای جستجو

`ورودی اعداد فارسی`, `کامپوننت React فارسی`, `فرمت‌بندی اعداد در React`, `ورودی عددی محلی‌سازی‌شده`, `ارقام فارسی`, `ورودی عددی React`, `فرمت‌کننده اعداد`, `کامپوننت TypeScript React`, `ورودی چندزبانه`, `هوک فرمت‌بندی اعداد`, `ابزار اعداد فارسی`

### 📄 مجوز

MIT License
