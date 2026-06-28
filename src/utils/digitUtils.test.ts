import { describe, it, expect } from "vitest";
import {
  toEnglishDigits,
  toLocalizedDigits,
  localizeDecimalSeparator,
  groupDigits,
  sanitizeNumericInput,
  roundToDecimals,
  digitsMap,
  decimalSeparatorMap,
  convertToEnglishDigits,
} from "./digitUtils";

describe("toEnglishDigits / convertToEnglishDigits", () => {
  it("converts Persian digits to English", () => {
    expect(toEnglishDigits("۱۲۳۴۵۶۷۸۹۰")).toBe("1234567890");
  });

  it("converts Arabic digits to English", () => {
    expect(toEnglishDigits("١٢٣٤٥٦٧٨٩٠")).toBe("1234567890");
  });

  it("converts Persian decimal separator to dot", () => {
    expect(toEnglishDigits("۱۲٫۳۴")).toBe("12.34");
  });

  it("converts slash to dot as decimal separator", () => {
    expect(toEnglishDigits("۱۲/۳۴")).toBe("12.34");
  });

  it("leaves English digits unchanged", () => {
    expect(toEnglishDigits("123.45")).toBe("123.45");
  });

  it("handles mixed locale digits", () => {
    expect(toEnglishDigits("۱۲٣۴")).toBe("1234");
  });

  it("handles empty string", () => {
    expect(toEnglishDigits("")).toBe("");
  });

  it("converts custom decimal character when specified", () => {
    expect(toEnglishDigits("12,34", ",")).toBe("12.34");
  });

  it("does not convert non-decimal characters when custom decimalChar is used", () => {
    expect(toEnglishDigits("12a34", ",")).toBe("12a34");
  });

  it("is aliased as convertToEnglishDigits", () => {
    expect(convertToEnglishDigits("۱۲۳")).toBe("123");
  });

  it("preserves bare minus sign", () => {
    expect(toEnglishDigits("-")).toBe("-");
  });
});

describe("toLocalizedDigits", () => {
  it("converts English digits to Persian", () => {
    expect(toLocalizedDigits("1234567890", "fa")).toBe("۱۲۳۴۵۶۷۸۹۰");
  });

  it("converts English digits to Arabic", () => {
    expect(toLocalizedDigits("1234567890", "ar")).toBe("١٢٣٤٥٦٧٨٩٠");
  });

  it("defaults to Persian for unknown locale", () => {
    expect(toLocalizedDigits("123", "unknown")).toBe("۱۲۳");
  });

  it("leaves non-digit characters unchanged", () => {
    expect(toLocalizedDigits("12.34", "fa")).toBe("۱۲.۳۴");
  });

  it("handles empty string", () => {
    expect(toLocalizedDigits("", "fa")).toBe("");
  });

  it("handles mixed content with digits and text", () => {
    expect(toLocalizedDigits("12 meters", "fa")).toBe("۱۲ meters");
  });
});

describe("localizeDecimalSeparator", () => {
  it("replaces dot with Persian separator", () => {
    expect(localizeDecimalSeparator("12.34", "fa")).toBe("12٫34");
  });

  it("replaces dot with Arabic separator", () => {
    expect(localizeDecimalSeparator("12.34", "ar")).toBe("12٫34");
  });

  it("uses custom decimal character", () => {
    expect(localizeDecimalSeparator("12.34", "en", ",")).toBe("12,34");
  });

  it("does nothing if no dot present", () => {
    expect(localizeDecimalSeparator("1234", "fa")).toBe("1234");
  });

  it("only replaces first dot", () => {
    expect(localizeDecimalSeparator("12.34.56", "fa")).toBe("12٫34.56");
  });
});

describe("groupDigits", () => {
  it("groups by 3 with comma", () => {
    expect(groupDigits("1000", 3, ",")).toBe("1,000");
    expect(groupDigits("1000000", 3, ",")).toBe("1,000,000");
    expect(groupDigits("1234567890", 3, ",")).toBe("1,234,567,890");
  });

  it("groups with custom separator", () => {
    expect(groupDigits("1000000", 3, "/")).toBe("1/000/000");
  });

  it("groups by 2 (Indian system)", () => {
    expect(groupDigits("10000", 2, ",")).toBe("1,00,00");
  });

  it("returns original if separatorCount is 0", () => {
    expect(groupDigits("1234", 0, ",")).toBe("1234");
  });

  it("returns original if separatorCount is negative", () => {
    expect(groupDigits("1234", -1, ",")).toBe("1234");
  });

  it("handles small numbers without grouping", () => {
    expect(groupDigits("123", 3, ",")).toBe("123");
    expect(groupDigits("99", 3, ",")).toBe("99");
  });

  it("handles empty string", () => {
    expect(groupDigits("", 3, ",")).toBe("");
  });

  it("uses comma as default separatorChar", () => {
    expect(groupDigits("1000", 3)).toBe("1,000");
  });
});

describe("sanitizeNumericInput", () => {
  it("returns empty string for null/undefined", () => {
    expect(sanitizeNumericInput(null)).toBe("");
    expect(sanitizeNumericInput(undefined)).toBe("");
  });

  it("converts Persian digits to English and removes non-numeric", () => {
    expect(sanitizeNumericInput("۱۲۳")).toBe("123");
  });

  it("converts Arabic digits to English and removes non-numeric", () => {
    expect(sanitizeNumericInput("١٢٣")).toBe("123");
  });

  it("removes non-numeric characters", () => {
    expect(sanitizeNumericInput("12a3b4")).toBe("1234");
    expect(sanitizeNumericInput("abc")).toBe("");
  });

  it("handles single decimal point", () => {
    expect(sanitizeNumericInput("12.34")).toBe("12.34");
  });

  it("removes extra decimal points", () => {
    expect(sanitizeNumericInput("12.34.56")).toBe("12.34");
  });

  it("removes leading zeros", () => {
    expect(sanitizeNumericInput("00123")).toBe("123");
    expect(sanitizeNumericInput("000")).toBe("0");
  });

  it("preserves leading zero before decimal", () => {
    expect(sanitizeNumericInput("0.123")).toBe("0.123");
  });

  it("truncates decimals to maxDecimals", () => {
    expect(sanitizeNumericInput("12.3456", 2)).toBe("12.34");
    expect(sanitizeNumericInput("12.3", 2)).toBe("12.3");
  });

  it("removes all decimals when maxDecimals is 0", () => {
    expect(sanitizeNumericInput("12.34", 0)).toBe("12");
  });

  it("preserves trailing dot when value ends with decimalChar", () => {
    expect(sanitizeNumericInput("12.", 2, ".")).toBe("12.");
  });

  it("handles Persian decimal separator", () => {
    expect(sanitizeNumericInput("۱۲٫۳۴", undefined, "٫")).toBe("12.34");
  });

  it("handles trailing dot with maxDecimals and decimalChar", () => {
    expect(sanitizeNumericInput("12.", 2, ".")).toBe("12.");
  });

  it("handles number input", () => {
    expect(sanitizeNumericInput(12345)).toBe("12345");
    expect(sanitizeNumericInput(12.34)).toBe("12.34");
  });

  it("handles mixed locale input", () => {
    expect(sanitizeNumericInput("۱۲٣۴")).toBe("1234");
  });

  it("preserves negative sign", () => {
    expect(sanitizeNumericInput("-1234")).toBe("-1234");
    expect(sanitizeNumericInput("-12.34")).toBe("-12.34");
  });

  it("removes leading zeros with negative sign", () => {
    expect(sanitizeNumericInput("-00123")).toBe("-123");
  });

  it("ignores second decimal point with negative numbers", () => {
    expect(sanitizeNumericInput("-12.34.56")).toBe("-12.34");
  });

  // FAILS: bare "-" was stripped to "" — BUG 6
  it("preserves bare minus as intermediate state", () => {
    expect(sanitizeNumericInput("-")).toBe("-");
  });

  // FAILS: "-0" was stripped to "0" — BUG 6
  it("preserves minus before zero", () => {
    expect(sanitizeNumericInput("-0")).toBe("-0");
  });

  it("removes minus that is not at the start", () => {
    expect(sanitizeNumericInput("1-23")).toBe("123");
    expect(sanitizeNumericInput("-12-3")).toBe("-123");
  });
});

describe("roundToDecimals", () => {
  it("returns value unchanged if maxDecimals is undefined", () => {
    expect(roundToDecimals("12.3456")).toBe("12.3456");
  });

  it("returns value unchanged if no decimal point", () => {
    expect(roundToDecimals("123", 2)).toBe("123");
  });

  it("truncates to maxDecimals", () => {
    expect(roundToDecimals("12.3456", 2)).toBe("12.34");
    expect(roundToDecimals("12.3", 2)).toBe("12.3");
  });

  it("removes decimal when maxDecimals is 0", () => {
    expect(roundToDecimals("12.34", 0)).toBe("12");
  });

  it("handles empty string", () => {
    expect(roundToDecimals("", 2)).toBe("");
  });

  it("handles integer part only correctly", () => {
    expect(roundToDecimals("100", 3)).toBe("100");
  });
});

describe("digitsMap", () => {
  it("has correct Persian digits", () => {
    expect(digitsMap.fa).toEqual(["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]);
  });

  it("has correct Arabic digits", () => {
    expect(digitsMap.ar).toEqual(["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]);
  });
});

describe("decimalSeparatorMap", () => {
  it("has Persian/Arabic decimal separator", () => {
    expect(decimalSeparatorMap.fa).toBe("٫");
    expect(decimalSeparatorMap.ar).toBe("٫");
  });
});
