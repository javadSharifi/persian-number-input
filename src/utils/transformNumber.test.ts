import { describe, it, expect } from "vitest";
import { transformNumber } from "./transformNumber";

describe("transformNumber", () => {
  describe("basic number formatting", () => {
    it("formats simple integer with Persian digits and grouping", () => {
      expect(transformNumber("1000")).toBe("۱,۰۰۰");
      expect(transformNumber("1000000")).toBe("۱,۰۰۰,۰۰۰");
      expect(transformNumber("1234567890")).toBe("۱,۲۳۴,۵۶۷,۸۹۰");
    });

    it("handles small numbers without grouping", () => {
      expect(transformNumber("123")).toBe("۱۲۳");
      expect(transformNumber("99")).toBe("۹۹");
    });

    it("handles decimal numbers", () => {
      expect(transformNumber("1234.56")).toBe("۱,۲۳۴٫۵۶");
      expect(transformNumber("12.345")).toBe("۱۲٫۳۴۵");
    });

    it("handles trailing dot", () => {
      expect(transformNumber("1234.")).toBe("۱,۲۳۴٫");
    });
  });

  describe("empty and null handling", () => {
    it("returns empty string for undefined", () => {
      expect(transformNumber(undefined)).toBe("");
    });

    it("returns empty string for null", () => {
      expect(transformNumber(null as unknown as string)).toBe("");
    });

    it("returns empty string for empty string", () => {
      expect(transformNumber("")).toBe("");
    });

    it("returns localized zero when showZero is true and input is empty", () => {
      expect(transformNumber("", { showZero: true })).toBe("۰");
      expect(transformNumber(undefined, { showZero: true })).toBe("۰");
      expect(transformNumber(null as unknown as string, { showZero: true })).toBe("۰");
    });

    it("returns localized zero with suffix when showZero is true", () => {
      expect(transformNumber("", { showZero: true, suffix: "متر" })).toBe("۰ متر");
    });
  });

  describe("locale variations", () => {
    it("formats with Persian locale (default)", () => {
      expect(transformNumber("1234", { locale: "fa" })).toBe("۱,۲۳۴");
    });

    it("formats with Arabic locale", () => {
      expect(transformNumber("1234", { locale: "ar" })).toBe("١,٢٣٤");
    });

    it("formats with English locale", () => {
      expect(transformNumber("1234", { locale: "en" })).toBe("1,234");
    });

    it("keeps English digits and separator for English locale", () => {
      expect(transformNumber("1234.56", { locale: "en" })).toBe("1,234.56");
    });
  });

  describe("custom separator", () => {
    it("uses custom separator character", () => {
      expect(transformNumber("1000000", { separatorChar: "/" })).toBe("۱/۰۰۰/۰۰۰");
    });

    it("uses custom separator count", () => {
      expect(transformNumber("10000", { separatorCount: 2 })).toBe("۱,۰۰,۰۰");
    });

    it("disables grouping with separatorCount <= 0", () => {
      expect(transformNumber("1000000", { separatorCount: 0 })).toBe("۱۰۰۰۰۰۰");
    });
  });

  describe("custom decimal character", () => {
    it("uses custom decimal character", () => {
      expect(transformNumber("1234.56", { decimalChar: "," })).toBe("۱,۲۳۴,۵۶");
    });

    it("uses custom decimal with English locale", () => {
      expect(transformNumber("1234.56", { locale: "en", decimalChar: "," })).toBe("1,234,56");
    });
  });

  describe("suffix", () => {
    it("appends suffix", () => {
      expect(transformNumber("1234", { suffix: "متر" })).toBe("۱,۲۳۴ متر");
    });

    it("appends suffix with decimal", () => {
      expect(transformNumber("1234.5", { suffix: "kg" })).toBe("۱,۲۳۴٫۵ kg");
    });

    it("handles English locale with suffix", () => {
      expect(transformNumber("1234", { locale: "en", suffix: "units" })).toBe("1,234 units");
    });
  });

  describe("maxDecimals", () => {
    it("does not truncate decimals (maxDecimals only applied in hook onBlur)", () => {
      expect(transformNumber("1234.5678", { maxDecimals: 2 })).toBe("۱,۲۳۴٫۵۶۷۸");
    });

    it("does not remove decimals when maxDecimals is 0", () => {
      expect(transformNumber("1234.56", { maxDecimals: 0 })).toBe("۱,۲۳۴٫۵۶");
    });

    it("does not affect numbers without decimals", () => {
      expect(transformNumber("1234", { maxDecimals: 2 })).toBe("۱,۲۳۴");
    });
  });

  describe("negative numbers", () => {
    it("handles negative numbers with leading minus in raw input", () => {
      expect(transformNumber("-1234")).toBe("-۱,۲۳۴");
      expect(transformNumber("-1234.56")).toBe("-۱,۲۳۴٫۵۶");
    });

    it("handles negative with English locale", () => {
      expect(transformNumber("-1234", { locale: "en" })).toBe("-1,234");
    });
  });

  describe("edge cases", () => {
    it("handles single digit", () => {
      expect(transformNumber("5")).toBe("۵");
    });

    it("handles zero", () => {
      expect(transformNumber("0")).toBe("۰");
    });

    it("handles very large numbers", () => {
      expect(transformNumber("999999999999999")).toBe("۹۹۹,۹۹۹,۹۹۹,۹۹۹,۹۹۹");
    });

    it("handles decimal only (no integer part before dot)", () => {
      expect(transformNumber(".5")).toBe("۰٫۵");
    });

    it("handles partial fractional input during typing", () => {
      expect(transformNumber("1234.")).toBe("۱,۲۳۴٫");
    });
  });

  describe("showZero with formatted output", () => {
    it("shows zero with formatting when rawValue is empty", () => {
      expect(transformNumber("", { showZero: true })).toBe("۰");
    });

    it("shows zero with suffix and formatting", () => {
      expect(transformNumber("", { showZero: true, suffix: "ریال" })).toBe("۰ ریال");
    });
  });
});
