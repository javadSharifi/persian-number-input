# Persian Number Input — React Component for Farsi, Arabic & RTL Number Formatting

[فارسی](./README.fa.md) | English

A lightweight React library for **Persian (Farsi) and Arabic number inputs** with automatic digit conversion, thousand-separator formatting, decimal precision, and full RTL support. No more manual conversion — users type in their native digits, your form receives clean English numbers.

[![npm version](https://img.shields.io/npm/v/persian-number-input.svg)](https://www.npmjs.com/package/persian-number-input)
[![npm downloads](https://img.shields.io/npm/dm/persian-number-input.svg)](https://www.npmjs.com/package/persian-number-input)
[![bundle size](https://img.shields.io/bundlephobia/minzip/persian-number-input)](https://bundlephobia.com/package/persian-number-input)
[![license](https://img.shields.io/npm/l/persian-number-input.svg)](https://github.com/javadSharifi/persian-number-input/blob/main/LICENSE)

## 🚀 [Live Demo](https://persian-number-input.netlify.app/)

---

## Why Persian Number Input?

Building forms for Persian or Arabic-speaking users comes with real challenges:

- Users naturally type `۱۲۳۴` — but your API expects `1234`
- Standard `<input type="number">` doesn't support Persian or Arabic digits at all
- Cursor jumps erratically when formatting thousand separators on the fly
- Decimal handling differs across locales (`٫` vs `.`)
- RTL inputs need right-aligned text and correct suffix placement

This library solves all of these automatically:

```
User types:   ۱۲۳۴۵۶۷
Displayed as: ۱,۲۳۴,۵۶۷
Form receives: "1234567"
```

---

## ✨ Features

- 🔢 **Automatic digit conversion** — Persian (۰-۹) and Arabic (٠-٩) to English and back
- 🌍 **Multi-locale** — `fa` (Farsi/Persian), `ar` (Arabic), `en` (English)
- 📊 **Thousand separator formatting** — customizable separator character and group size
- 💰 **Currency-ready** — add prefix, suffix (e.g. تومان, ریال, ر.س), and custom decimal separator
- ⚡ **~1KB gzipped** — zero extra dependencies, pure TypeScript
- 🎯 **TypeScript** — full type definitions included
- 🔄 **Cursor-position preservation** — no jump on re-format
- ✅ **Min/max validation** — built-in range enforcement and decimal precision control
- ♿ **Accessible** — follows WCAG input best practices

---

## 📦 Installation

```bash
npm install persian-number-input
# or
yarn add persian-number-input
# or
pnpm add persian-number-input
```

> **Requirements:** React 16.8+, works with Next.js, Vite, CRA, and any React-based framework.

---

## 🎯 Quick Start

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

Output displayed to user: `۱,۲۳۴,۵۶۷`

---

## 📚 Usage Examples

### Persian Toman currency input

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

Displayed: `۵,۰۰۰,۰۰۰ تومان`

---

### Arabic locale (SAR)

```tsx
<PersianNumberInput
  initialValue={987654}
  locale="ar"
  separatorChar=","
  suffix="ر.س"
  onValueChange={(value) => console.log(value)}
/>
```

Displayed: `٩٨٧,٦٥٤ ر.س`

---

### Decimal numbers with custom separator

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

Displayed: `۱,۲۳۴٫۵۶`

---

### Price input with min/max validation

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

### With React Hook Form

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

### Using the hook directly (advanced)

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
    onValueChange: (val) => console.log("English value:", val),
  });

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      dir="rtl"
    />
  );
}
```

---

## 🛠️ API Reference

### `PersianNumberInput` props

| Prop             | Type                                   | Default     | Description                                          |
| ---------------- | -------------------------------------- | ----------- | ---------------------------------------------------- |
| `initialValue`   | `number \| string`                     | `undefined` | Initial value of the input                           |
| `locale`         | `"fa" \| "ar" \| "en"`                 | `"fa"`      | Digit locale — Farsi, Arabic, or English             |
| `separatorCount` | `number`                               | `3`         | Digits per group (3 = thousand separator)            |
| `separatorChar`  | `string`                               | `","`       | Thousand separator character                         |
| `decimalChar`    | `string`                               | Auto        | Decimal separator (`٫` for fa, `.` for en)          |
| `suffix`         | `string`                               | `undefined` | Currency or unit suffix (e.g. `تومان`, `ریال`)      |
| `maxDecimals`    | `number`                               | `undefined` | Maximum allowed decimal places                       |
| `min`            | `number`                               | `undefined` | Minimum allowed value                                |
| `max`            | `number`                               | `undefined` | Maximum allowed value                                |
| `showZero`       | `boolean`                              | `false`     | Display `0` instead of empty when value is zero      |
| `onValueChange`  | `(value: string \| undefined) => void` | `undefined` | Fires on change — always returns English digits      |

All standard HTML `<input>` props (e.g. `className`, `style`, `placeholder`, `disabled`) are also supported.

---

### Utility functions

#### `transformNumber(rawValue, options)`

Format any number string according to locale and options.

```tsx
import { transformNumber } from "persian-number-input";

transformNumber("1234567.89", {
  locale: "fa",
  separatorCount: 3,
  separatorChar: ",",
  maxDecimals: 2,
  suffix: "تومان",
});
// → "۱,۲۳۴,۵۶۷٫۸۹ تومان"
```

#### `toEnglishDigits(str, decimalChar?)`

Convert Persian or Arabic digits to English.

```tsx
import { toEnglishDigits } from "persian-number-input";

toEnglishDigits("۱۲۳۴"); // "1234"
toEnglishDigits("٩٨٧٦"); // "9876"
```

#### `toLocalizedDigits(numStr, locale)`

Convert English digits to the target locale.

```tsx
import { toLocalizedDigits } from "persian-number-input";

toLocalizedDigits("1234", "fa"); // "۱۲۳۴"
toLocalizedDigits("5678", "ar"); // "٥٦٧٨"
```

#### `sanitizeNumericInput(value, maxDecimals?, decimalChar?)`

Strip non-numeric characters and enforce decimal limits.

```tsx
import { sanitizeNumericInput } from "persian-number-input";

sanitizeNumericInput("۱۲۳abc۴۵۶", 2); // "123456"
sanitizeNumericInput("12.345.67", 2);  // "12.34"
```

---

## 🎨 Styling

The component accepts all standard input props including `className` and `style`:

```tsx
<PersianNumberInput
  locale="fa"
  className="w-full px-4 py-3 text-lg border-2 border-indigo-500 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-600"
/>
```

For RTL layouts, add `dir="rtl"` to the wrapper or `style={{ textAlign: "right" }}` on the input.

---

## 📊 Bundle Size

```
persian-number-input: ~1KB (minified + gzipped)
```

One of the smallest solutions for Persian/Arabic number input in the React ecosystem.

---

## 🏆 Comparison

| Feature                        | persian-number-input | Native `<input>` | Other libraries |
| ------------------------------ | :------------------: | :--------------: | :-------------: |
| Persian & Arabic digit input   | ✅                   | ❌               | ⚠️ Partial      |
| Cursor preservation on format  | ✅                   | ❌               | ⚠️ Often buggy  |
| Multi-locale (fa / ar / en)    | ✅                   | ❌               | ❌              |
| Thousand separator formatting  | ✅                   | ❌               | ⚠️ Limited      |
| Decimal precision control      | ✅                   | ❌               | ⚠️ Limited      |
| Min/max validation             | ✅                   | Partial          | ⚠️ Varies       |
| TypeScript support             | ✅                   | ✅               | ⚠️ Varies       |
| Bundle size                    | 🟢 ~1KB              | 🟢 Native        | 🔴 5–30KB       |
| Zero peer dependencies         | ✅                   | ✅               | ❌              |

---

## ❓ FAQ

**Q: Does this work with Next.js and Server Components?**  
A: Yes. The component is a client component — add `"use client"` at the top of your file when using it inside a Next.js App Router layout.

**Q: How do I get the numeric value back in English for my API?**  
A: The `onValueChange` callback always returns the raw English digit string (e.g. `"1234567"`), regardless of which locale is displayed.

**Q: Can I use this inside a form with native `onSubmit`?**  
A: Use `onValueChange` to store the value in local state, then read from state on submit. The component also supports React Hook Form via the `Controller` pattern (see example above).

**Q: Does it handle right-to-left text direction automatically?**  
A: The component formats numbers correctly for RTL — for full RTL layout, set `dir="rtl"` on your container or `style={{ textAlign: "right" }}` on the input.

**Q: What's the difference between `locale="fa"` and `locale="ar"`?**  
A: `fa` uses Persian digits (۰–۹) and the `٫` decimal separator. `ar` uses Eastern Arabic digits (٠–٩). Both return English digits to `onValueChange`.

**Q: Is there a maximum number size?**  
A: The library uses string-based numeric comparison for validation, so it handles arbitrarily large and precise numbers without floating-point artifacts.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

Please open an issue first for major changes so we can discuss the approach.

---

## 📄 License

MIT © [Javad Sharifi](https://github.com/javadSharifi)

---

## 📞 Support

- 💬 Telegram: [@Javad_sharifi98](https://t.me/Javad_sharifi98)
- 🐛 [Issue Tracker](https://github.com/javadSharifi/persian-number-input/issues)
- 💬 [Discussions](https://github.com/javadSharifi/persian-number-input/discussions)

---

**Made with ❤️ for Persian and Arabic developer communities**

<!-- Keywords for discoverability: persian number input react, farsi digit input, arabic number react component, rtl number input, persian input component, تبدیل اعداد فارسی به انگلیسی, ورودی عدد فارسی ریکت -->
