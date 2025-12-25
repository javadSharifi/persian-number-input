import { describe, it, expect } from "vitest";
import { sanitizeNumericInput } from "./digitUtils";
import { transformNumber } from "./transformNumber";

describe("Logic Tests (DigitUtils & Transform)", () => {
  it("should remove negative signs completely", () => {
    expect(sanitizeNumericInput("-12345")).toBe("12345");
    expect(sanitizeNumericInput("12-34")).toBe("1234");
  });

  it("should handle leading zeros correctly", () => {
    expect(sanitizeNumericInput("000123")).toBe("123");
    expect(sanitizeNumericInput("0222")).toBe("222");
    expect(sanitizeNumericInput("0")).toBe("0");
    expect(sanitizeNumericInput("0.5")).toBe("0.5");
  });

  it("should support custom decimal character", () => {
    const input = "12/5";
    const sanitized = sanitizeNumericInput(input, 2, "/");
    expect(sanitized).toBe("12.5");

    const display = transformNumber(sanitized, {
      decimalChar: "/",
      locale: "en",
    });
    expect(display).toBe("12/5");
  });

  it("should apply suffix in display", () => {
    const display = transformNumber("1500", { suffix: "تومان", locale: "en" });
    expect(display).toBe("1,500 تومان");
  });
});
