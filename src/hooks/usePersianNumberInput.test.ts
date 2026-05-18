import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePersianNumberInput } from "./usePersianNumberInput";

describe("usePersianNumberInput", () => {
  describe("initial state", () => {
    it("initializes with undefined rawValue", () => {
      const { result } = renderHook(() => usePersianNumberInput());
      expect(result.current.rawValue).toBe("");
      expect(result.current.value).toBe("");
    });

    it("initializes with a number initialValue", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: 1234 })
      );
      expect(result.current.rawValue).toBe("1234");
      expect(result.current.value).toBe("۱,۲۳۴");
    });

    it("initializes with a string initialValue", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "5678.9" })
      );
      expect(result.current.rawValue).toBe("5678.9");
      expect(result.current.value).toBe("۵,۶۷۸٫۹");
    });

    it("initializes with Persian digits in initialValue", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "۱۲۳۴" })
      );
      expect(result.current.rawValue).toBe("1234");
      expect(result.current.value).toBe("۱,۲۳۴");
    });

    it("initializes with showZero option", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "", showZero: true })
      );
      expect(result.current.value).toBe("۰");
    });

    it("initializes with English locale", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: 1234, locale: "en" })
      );
      expect(result.current.value).toBe("1,234");
    });
  });

  describe("onChange", () => {
    it("updates value on change", () => {
      const { result } = renderHook(() => usePersianNumberInput());

      act(() => {
        result.current.onChange({
          target: { value: "1234" },
        } as any);
      });

      expect(result.current.rawValue).toBe("1234");
      expect(result.current.value).toBe("۱,۲۳۴");
    });

    it("sanitizes non-numeric input", () => {
      const { result } = renderHook(() => usePersianNumberInput());

      act(() => {
        result.current.onChange({
          target: { value: "12abc34" },
        } as any);
      });

      expect(result.current.rawValue).toBe("1234");
      expect(result.current.value).toBe("۱,۲۳۴");
    });

    it("handles Persian digits input", () => {
      const { result } = renderHook(() => usePersianNumberInput());

      act(() => {
        result.current.onChange({
          target: { value: "۱۲۳۴" },
        } as any);
      });

      expect(result.current.rawValue).toBe("1234");
      expect(result.current.value).toBe("۱,۲۳۴");
    });

    it("handles Arabic digits input", () => {
      const { result } = renderHook(() => usePersianNumberInput());

      act(() => {
        result.current.onChange({
          target: { value: "١٢٣٤" },
        } as any);
      });

      expect(result.current.rawValue).toBe("1234");
      expect(result.current.value).toBe("۱,۲۳۴");
    });

    it("handles decimal input", () => {
      const { result } = renderHook(() => usePersianNumberInput());

      act(() => {
        result.current.onChange({
          target: { value: "12.34" },
        } as any);
      });

      expect(result.current.rawValue).toBe("12.34");
      expect(result.current.value).toBe("۱۲٫۳۴");
    });

    it("handles trailing dot input", () => {
      const { result } = renderHook(() => usePersianNumberInput());

      act(() => {
        result.current.onChange({
          target: { value: "12." },
        } as any);
      });

      expect(result.current.rawValue).toBe("12.");
      expect(result.current.value).toBe("۱۲٫");
    });

    it("handles backspace (removing last characters)", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "123456" })
      );

      expect(result.current.rawValue).toBe("123456");
      expect(result.current.value).toBe("۱۲۳,۴۵۶");

      act(() => {
        result.current.onChange({
          target: { value: "۱۲۳,۴" },
        } as any);
      });

      expect(result.current.rawValue).toBe("1234");
      expect(result.current.value).toBe("۱,۲۳۴");
    });

    it("handles deleting middle characters", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "123456" })
      );

      act(() => {
        result.current.onChange({
          target: { value: "۱۲۴۵۶" },
        } as any);
      });

      expect(result.current.rawValue).toBe("12456");
      expect(result.current.value).toBe("۱۲,۴۵۶");
    });

    it("handles empty input after clearing", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "1234" })
      );

      act(() => {
        result.current.onChange({
          target: { value: "" },
        } as any);
      });

      expect(result.current.rawValue).toBe("");
      expect(result.current.value).toBe("");
    });

    it("handles multiple decimal points (only first kept)", () => {
      const { result } = renderHook(() => usePersianNumberInput());

      act(() => {
        result.current.onChange({
          target: { value: "12.34.56" },
        } as any);
      });

      expect(result.current.rawValue).toBe("12.3456");
      expect(result.current.value).toBe("۱۲٫۳۴۵۶");
    });
  });

  describe("max validation", () => {
    it("allows value below max", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ max: 1000 })
      );

      act(() => {
        result.current.onChange({
          target: { value: "500" },
        } as any);
      });

      expect(result.current.rawValue).toBe("500");
    });

    it("allows value equal to max", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ max: 1000 })
      );

      act(() => {
        result.current.onChange({
          target: { value: "1000" },
        } as any);
      });

      expect(result.current.rawValue).toBe("1000");
    });

    it("blocks value above max", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ max: 1000 })
      );

      act(() => {
        result.current.onChange({
          target: { value: "1500" },
        } as any);
      });

      expect(result.current.rawValue).toBe("");
    });
  });

  describe("min validation (onBlur)", () => {
    it("does not change value above min on blur", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: 50, min: 10 })
      );

      act(() => {
        result.current.onBlur({} as any);
      });

      expect(result.current.rawValue).toBe("50");
    });

    it("clamps value to min on blur if below min", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: 5, min: 10 })
      );

      act(() => {
        result.current.onBlur({} as any);
      });

      expect(result.current.rawValue).toBe("10");
    });

    it("handles blur with empty value", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ min: 10 })
      );

      act(() => {
        result.current.onBlur({} as any);
      });

      expect(result.current.rawValue).toBe("");
    });

    it("handles blur with dot only value", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "." })
      );

      act(() => {
        result.current.onBlur({} as any);
      });

      expect(result.current.rawValue).toBe(".");
    });
  });

  describe("onValueChange callback", () => {
    it("calls onValueChange when value changes", () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        usePersianNumberInput({ onValueChange })
      );

      act(() => {
        result.current.onChange({
          target: { value: "1234" },
        } as any);
      });

      expect(onValueChange).toHaveBeenCalledWith("1234");
    });

    it("calls onValueChange with empty string when cleared", () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "1234", onValueChange })
      );

      act(() => {
        result.current.onChange({
          target: { value: "" },
        } as any);
      });

      expect(onValueChange).toHaveBeenCalledWith("");
    });

    it("calls onValueChange when clamped to min on blur", () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: 5, min: 10, onValueChange })
      );

      act(() => {
        result.current.onBlur({} as any);
      });

      expect(onValueChange).toHaveBeenCalledWith("10");
    });
  });

  describe("maxDecimals", () => {
    it("truncates decimals to maxDecimals on input", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ maxDecimals: 2 })
      );

      act(() => {
        result.current.onChange({
          target: { value: "12.3456" },
        } as any);
      });

      expect(result.current.rawValue).toBe("12.34");
      expect(result.current.value).toBe("۱۲٫۳۴");
    });

    it("allows typing decimal point with maxDecimals", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ maxDecimals: 2 })
      );

      act(() => {
        result.current.onChange({
          target: { value: "12." },
        } as any);
      });

      expect(result.current.rawValue).toBe("12.");
    });
  });

  describe("suffix", () => {
    it("includes suffix in display value", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ suffix: "متر" })
      );

      act(() => {
        result.current.onChange({
          target: { value: "1234" },
        } as any);
      });

      expect(result.current.value).toBe("۱,۲۳۴ متر");
    });
  });

  describe("custom separator", () => {
    it("uses custom separatorChar", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ separatorChar: "/" })
      );

      act(() => {
        result.current.onChange({
          target: { value: "1000000" },
        } as any);
      });

      expect(result.current.value).toBe("۱/۰۰۰/۰۰۰");
    });

    it("uses custom separatorCount", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ separatorCount: 2 })
      );

      act(() => {
        result.current.onChange({
          target: { value: "10000" },
        } as any);
      });

      expect(result.current.value).toBe("۱,۰۰,۰۰");
    });
  });

  describe("decimalChar", () => {
    it("uses custom decimalChar", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ decimalChar: "," })
      );

      act(() => {
        result.current.onChange({
          target: { value: "12,34" },
        } as any);
      });

      expect(result.current.rawValue).toBe("12.34");
      expect(result.current.value).toBe("۱۲,۳۴");
    });
  });

  describe("English locale", () => {
    it("formats with English digits", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ locale: "en" })
      );

      act(() => {
        result.current.onChange({
          target: { value: "1234" },
        } as any);
      });

      expect(result.current.value).toBe("1,234");
    });

    it("keeps dot as decimal separator", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ locale: "en" })
      );

      act(() => {
        result.current.onChange({
          target: { value: "12.34" },
        } as any);
      });

      expect(result.current.value).toBe("12.34");
    });
  });

  describe("setRawValue (updateValue)", () => {
    it("sets raw value directly", () => {
      const { result } = renderHook(() => usePersianNumberInput());

      act(() => {
        result.current.setRawValue("9999");
      });

      expect(result.current.rawValue).toBe("9999");
      expect(result.current.value).toBe("۹,۹۹۹");
    });

    it("respects max validation", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ max: 1000 })
      );

      act(() => {
        result.current.setRawValue("9999");
      });

      expect(result.current.rawValue).toBe("");
    });
  });

  describe("inputRef", () => {
    it("provides inputRef", () => {
      const { result } = renderHook(() => usePersianNumberInput());
      expect(result.current.inputRef).toBeDefined();
      expect(result.current.inputRef.current).toBeNull();
    });
  });

  describe("rapid typing simulation (deleting last two characters)", () => {
    it("correctly handles deleting last character", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "12345" })
      );

      expect(result.current.value).toBe("۱۲,۳۴۵");

      act(() => {
        result.current.onChange({
          target: { value: "۱۲,۳۴" },
        } as any);
      });

      expect(result.current.rawValue).toBe("1234");
      expect(result.current.value).toBe("۱,۲۳۴");
    });

    it("correctly handles deleting two characters", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "123456" })
      );

      expect(result.current.value).toBe("۱۲۳,۴۵۶");

      act(() => {
        result.current.onChange({
          target: { value: "۱۲,۴۵" },
        } as any);
      });

      expect(result.current.rawValue).toBe("1245");
      expect(result.current.value).toBe("۱,۲۴۵");
    });

    it("correctly handles deleting from middle", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "123456" })
      );

      act(() => {
        result.current.onChange({
          target: { value: "۱۳۴۵۶" },
        } as any);
      });

      expect(result.current.rawValue).toBe("13456");
      expect(result.current.value).toBe("۱۳,۴۵۶");
    });

    it("correctly handles adding a digit", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "1234" })
      );

      act(() => {
        result.current.onChange({
          target: { value: "۱۲۳۴۵" },
        } as any);
      });

      expect(result.current.rawValue).toBe("12345");
      expect(result.current.value).toBe("۱۲,۳۴۵");
    });
  });

  describe("direction-independent character deletion", () => {
    it("correctly handles deleting first character (LTR start)", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "123456" })
      );

      expect(result.current.value).toBe("۱۲۳,۴۵۶");

      act(() => {
        result.current.onChange({
          target: { value: "۲۳,۴۵۶" },
        } as any);
      });

      expect(result.current.rawValue).toBe("23456");
      expect(result.current.value).toBe("۲۳,۴۵۶");
    });

    it("correctly handles deleting last character (LTR end)", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "123456" })
      );

      expect(result.current.value).toBe("۱۲۳,۴۵۶");

      act(() => {
        result.current.onChange({
          target: { value: "۱۲,۳۴۵" },
        } as any);
      });

      expect(result.current.rawValue).toBe("12345");
      expect(result.current.value).toBe("۱۲,۳۴۵");
    });

    it("correctly handles deleting decimal separator", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "1234.56" })
      );

      expect(result.current.value).toBe("۱,۲۳۴٫۵۶");

      act(() => {
        result.current.onChange({
          target: { value: "۱,۲۳۴۵۶" },
        } as any);
      });

      expect(result.current.rawValue).toBe("123456");
      expect(result.current.value).toBe("۱۲۳,۴۵۶");
    });

    it("correctly handles partial decimal deletion", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "1234.56" })
      );

      expect(result.current.value).toBe("۱,۲۳۴٫۵۶");

      act(() => {
        result.current.onChange({
          target: { value: "۱,۲۳۴٫۵" },
        } as any);
      });

      expect(result.current.rawValue).toBe("1234.5");
      expect(result.current.value).toBe("۱,۲۳۴٫۵");
    });

    it("correctly handles deleting all decimal digits", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "1234.56" })
      );

      expect(result.current.value).toBe("۱,۲۳۴٫۵۶");

      act(() => {
        result.current.onChange({
          target: { value: "۱,۲۳۴" },
        } as any);
      });

      expect(result.current.rawValue).toBe("1234");
      expect(result.current.value).toBe("۱,۲۳۴");
    });

    it("correctly handles trailing dot deletion", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "1234." })
      );

      expect(result.current.value).toBe("۱,۲۳۴٫");

      act(() => {
        result.current.onChange({
          target: { value: "۱,۲۳۴" },
        } as any);
      });

      expect(result.current.rawValue).toBe("1234");
      expect(result.current.value).toBe("۱,۲۳۴");
    });

    it("correctly handles suffix value deletion", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "1234", suffix: "متر" })
      );

      expect(result.current.value).toBe("۱,۲۳۴ متر");

      act(() => {
        result.current.onChange({
          target: { value: "۱,۲۳" },
        } as any);
      });

      expect(result.current.rawValue).toBe("123");
      expect(result.current.value).toBe("۱۲۳ متر");
    });

    it("correctly handles rapid multiple deletions", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "1234567890" })
      );

      expect(result.current.value).toBe("۱,۲۳۴,۵۶۷,۸۹۰");

      act(() => {
        result.current.onChange({
          target: { value: "۱,۲۳۴" },
        } as any);
      });

      expect(result.current.rawValue).toBe("1234");
      expect(result.current.value).toBe("۱,۲۳۴");
    });

    it("correctly handles mixed locale digit deletion", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "123456" })
      );

      expect(result.current.value).toBe("۱۲۳,۴۵۶");

      act(() => {
        result.current.onChange({
          target: { value: "۱٢۳,۴۶" },
        } as any);
      });

      expect(result.current.rawValue).toBe("12346");
      expect(result.current.value).toBe("۱۲,۳۴۶");
    });

    it("correctly handles English locale deletion", () => {
      const { result } = renderHook(() =>
        usePersianNumberInput({ initialValue: "123456", locale: "en" })
      );

      expect(result.current.value).toBe("123,456");

      act(() => {
        result.current.onChange({
          target: { value: "12,45" },
        } as any);
      });

      expect(result.current.rawValue).toBe("1245");
      expect(result.current.value).toBe("1,245");
    });
  });
});
