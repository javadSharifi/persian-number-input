import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePersianNumberInput } from "./usePersianNumberInput";
import type React from "react";

function setup(props: Record<string, unknown> = {}) {
  const input = document.createElement("input");
  document.body.appendChild(input);

  const hookResult = renderHook(() =>
    usePersianNumberInput({
      locale: "en",
      separatorChar: ",",
      ...props,
    } as Record<string, unknown>)
  );

  Object.defineProperty(hookResult.result.current.inputRef, "current", {
    value: input,
    writable: true,
  });

  function simulateChange(value: string, selectionStart: number) {
    input.value = value;
    input.setSelectionRange(selectionStart, selectionStart);
    act(() => {
      hookResult.result.current.onChange({
        target: input,
        currentTarget: input,
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });
  }

  function simulatePaste(pastedText: string, selStart: number, selEnd: number) {
    input.value = hookResult.result.current.value;
    input.setSelectionRange(selStart, selEnd);
    const clipboardData = { getData: (_type: string) => pastedText };
    act(() => {
      hookResult.result.current.onPaste({
        preventDefault: () => {},
        currentTarget: input,
        clipboardData,
      } as unknown as React.ClipboardEvent<HTMLInputElement>);
    });
  }

  function simulateKeyDown(key: string, selStart = 0, currentValue?: string) {
    if (currentValue !== undefined) input.value = currentValue;
    input.setSelectionRange(selStart, selStart);
    const prevented: boolean[] = [];
    act(() => {
      hookResult.result.current.onKeyDown({
        key,
        ctrlKey: false,
        metaKey: false,
        altKey: false,
        currentTarget: input,
        preventDefault: () => prevented.push(true),
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });
    return { wasBlocked: prevented.length > 0 };
  }

  return { hookResult, input, simulateChange, simulatePaste, simulateKeyDown };
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("usePersianNumberInput", () => {
  describe("initial state", () => {
    it("initializes with empty rawValue when no initialValue", () => {
      const { hookResult } = setup();
      expect(hookResult.result.current.rawValue).toBe("");
      expect(hookResult.result.current.value).toBe("");
    });

    it("initializes with number initialValue", () => {
      const { hookResult } = setup({ initialValue: 1234 });
      expect(hookResult.result.current.rawValue).toBe("1234");
      expect(hookResult.result.current.value).toBe("1,234");
    });

    it("initializes with string initialValue", () => {
      const { hookResult } = setup({ initialValue: "56789" });
      expect(hookResult.result.current.rawValue).toBe("56789");
      expect(hookResult.result.current.value).toBe("56,789");
    });

    it("provides inputRef", () => {
      const { hookResult, input } = setup();
      expect(hookResult.result.current.inputRef.current).toBe(input);
    });
  });

  describe("onChange happy path", () => {
    it("updates rawValue and display value", () => {
      const { hookResult, simulateChange } = setup();
      simulateChange("1234", 4);
      expect(hookResult.result.current.rawValue).toBe("1234");
      expect(hookResult.result.current.value).toBe("1,234");
    });

    it("sanitizes non-numeric characters", () => {
      const { hookResult, simulateChange } = setup();
      simulateChange("12abc34", 6);
      expect(hookResult.result.current.rawValue).toBe("1234");
    });

    it("handles empty input", () => {
      const { hookResult, simulateChange } = setup({ initialValue: "1234" });
      simulateChange("", 0);
      expect(hookResult.result.current.rawValue).toBe("");
      expect(hookResult.result.current.value).toBe("");
    });

    it("clamps to max on blur and resets isInvalid", () => {
      const { hookResult, simulateChange, input } = setup({ max: 100 });
      simulateChange("150", 3);
      expect(hookResult.result.current.isInvalid).toBe(true);

      act(() => {
        hookResult.result.current.onBlur({
          target: input,
          currentTarget: input,
        } as unknown as React.FocusEvent<HTMLInputElement>);
      });

      expect(hookResult.result.current.rawValue).toBe("100");
      expect(hookResult.result.current.isInvalid).toBe(false);
    });

    it("calls onValueChange for valid values", () => {
      const onValueChange = vi.fn();
      const { simulateChange } = setup({ onValueChange });
      simulateChange("1234", 4);
      expect(onValueChange).toHaveBeenCalledWith("1234");
    });
  });

  // ─── BUG 1: cursor jumps when deleting near a thousands-separator ───

  describe("BUG 1 — cursor jumps when deleting near a thousands-separator", () => {
    // FAILS: old cursor calc used length-diff, giving position 2 instead of 3
    it("cursor at end after deleting last digit when separator disappears", () => {
      const { input, simulateChange } = setup({ initialValue: "1234" });
      // "1,234" → delete "4" → "1,23", cursor at 4
      simulateChange("1,23", 4);
      // "1,23" sanitized to "123", formatted "123", cursor should be at end (3)
      expect(input.selectionStart).toBe(3);
    });

    // FAILS: old cursor calc gave diff=-1 → cursor=2 instead of 4
    it("cursor after deleting digit before separator in grouped number", () => {
      const { input, simulateChange } = setup({ initialValue: "123456" });
      // "123,456" → delete "3" (position 3) → "12,456", cursor at 3
      simulateChange("12,456", 3);
      // sanitized "12456", formatted "12,456", cursor should be at raw pos 3 → formatted 4
      expect(input.selectionStart).toBe(4);
    });

    // FAILS: old cursor calc gave diff=0 → cursor=4 instead of 5
    it("cursor after deleting first digit", () => {
      const { input, simulateChange } = setup({ initialValue: "1234" });
      // "1,234" → delete "1" (position 0) → ",234" (sanitized to "234"), cursor at 0
      simulateChange(",234", 0);
      // sanitized "234", formatted "234", cursor should be at 0
      expect(input.selectionStart).toBe(0);
    });
  });

  // ─── BUG 2: useEffect resets user input on parent re-render ───

  describe("BUG 2 — useEffect resets user-typed value when parent re-renders", () => {
    // FAILS: useEffect re-sanitizes initialValue on every render, wiping user input
    it("user input survives parent re-render with same initialValue", () => {
      const { result, rerender } = renderHook(
        ({ initialValue, locale, separatorChar }) =>
          usePersianNumberInput({ initialValue, locale, separatorChar }),
        {
          initialProps: {
            initialValue: 100 as number | string | undefined,
            locale: "en",
            separatorChar: ",",
          },
        }
      );

      const input = document.createElement("input");
      document.body.appendChild(input);
      Object.defineProperty(result.current.inputRef, "current", {
        value: input,
        writable: true,
      });

      input.value = "999";
      input.setSelectionRange(3, 3);
      act(() => {
        result.current.onChange({
          target: input,
          currentTarget: input,
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.rawValue).toBe("999");

      rerender({
        initialValue: 100,
        locale: "en",
        separatorChar: ",",
      });

      // MUST NOT reset to "100"
      expect(result.current.rawValue).toBe("999");

      document.body.removeChild(input);
    });
  });

  // ─── BUG 3: same-length edits don't restore cursor ───

  describe("BUG 3 — same-length edits don't restore cursor", () => {
    // FAILS: rawValue.length is same, trigger unchanged,
    //        useLayoutEffect never fires → setSelectionRange not called
    it("setSelectionRange called after same-length edit", () => {
      const { hookResult, input } = setup({ initialValue: "12345" });

      input.value = "12,347";
      input.setSelectionRange(6, 6);

      const spy = vi.spyOn(input, "setSelectionRange");

      act(() => {
        hookResult.result.current.onChange({
          target: input,
          currentTarget: input,
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      });

      expect(spy).toHaveBeenCalledWith(6, 6);
      spy.mockRestore();
    });

    it("setSelectionRange called after replacing a middle digit", () => {
      const { hookResult, input } = setup({ initialValue: "12345" });

      input.value = "12,947";
      input.setSelectionRange(4, 4);

      const spy = vi.spyOn(input, "setSelectionRange");

      act(() => {
        hookResult.result.current.onChange({
          target: input,
          currentTarget: input,
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      });

      expect(spy).toHaveBeenCalledWith(4, 4);
      spy.mockRestore();
    });
  });

  // ─── BUG 4: updateValue in onKeyDown deps causes unnecessary re-creation ───

  describe("BUG 4 — updateValue in onKeyDown deps causes unnecessary re-creation", () => {
    // FAILS: updateValue is listed in onKeyDown's deps but never used inside it.
    //        This test checks that onKeyDown still functions correctly after
    //        updateValue changes (e.g. after calling setRawValue).
    it("onKeyDown still blocks non-numeric keys after updateValue changes", () => {
      const { hookResult, input, simulateKeyDown } = setup({ locale: "en" });

      const digitResult = simulateKeyDown("5", 0, "");
      expect(digitResult.wasBlocked).toBe(false);

      act(() => {
        hookResult.result.current.setRawValue("123");
      });

      const alphaResult = simulateKeyDown("a", 3, "123");
      expect(alphaResult.wasBlocked).toBe(true);
    });
  });

  // ─── BUG 5: paste replaces entire value instead of inserting at cursor ───

  describe("BUG 5 — paste replaces entire value instead of inserting at cursor", () => {
    // FAILS: old paste replaced entire input with just pasted text
    it("pastes into middle of value", () => {
      const { hookResult, simulatePaste } = setup({ initialValue: "12345" });

      // Formatted: "12,345". Select "34" (formatted positions 3-5), paste "99"
      simulatePaste("99", 3, 5);

      expect(hookResult.result.current.rawValue).toBe("12995");
    });

    it("pastes at start of value", () => {
      const { hookResult, simulatePaste } = setup({ initialValue: "12345" });

      simulatePaste("99", 0, 0);

      expect(hookResult.result.current.rawValue).toBe("9912345");
    });

    it("pastes at end of value", () => {
      const { hookResult, simulatePaste } = setup({ initialValue: "12345" });

      // Formatted: "12,345". Cursor at end (formatted position 6)
      simulatePaste("99", 6, 6);

      expect(hookResult.result.current.rawValue).toBe("1234599");
    });

    it("pastes replacing entire selection", () => {
      const { hookResult, simulatePaste } = setup({ initialValue: "12345" });

      // Formatted: "12,345". Select all (positions 0-6), paste "99"
      simulatePaste("99", 0, 6);

      expect(hookResult.result.current.rawValue).toBe("99");
    });
  });

  // ─── BUG 6: bare "-" causes input to go blank ───

  describe("BUG 6 — bare '-' causes input to go blank", () => {
    // FAILS: old sanitizeNumericInput stripped bare "-" to ""
    it("typing bare minus preserves it as rawValue", () => {
      const { hookResult, simulateChange } = setup();

      simulateChange("-", 1);

      expect(hookResult.result.current.rawValue).toBe("-");
    });

    it("typing minus-zero preserves both", () => {
      const { hookResult, simulateChange } = setup();

      simulateChange("-0", 2);

      expect(hookResult.result.current.rawValue).toBe("-0");
    });

    it("can type negative number after starting with minus", () => {
      const { hookResult, simulateChange } = setup();

      simulateChange("-", 1);
      expect(hookResult.result.current.rawValue).toBe("-");

      simulateChange("-1", 2);
      expect(hookResult.result.current.rawValue).toBe("-1");
    });
  });

  // ─── BUG 7: suffix — tested in transformNumber.test.ts  ───
  // (covered by transformNumber unit tests)

  // ─── BUG 8: "-" key allowed anywhere by keyFilter ───

  describe("BUG 8 — '-' key allowed anywhere by keyFilter", () => {
    // FAILS: old keyFilter allowed "-" at any position
    it("blocks minus when cursor is not at position 0", () => {
      const { simulateKeyDown } = setup({ initialValue: "123" });

      const { wasBlocked } = simulateKeyDown("-", 2, "123");

      expect(wasBlocked).toBe(true);
    });

    it("allows minus when cursor is at position 0 and value has no minus", () => {
      const { simulateKeyDown } = setup({ initialValue: "" });

      const { wasBlocked } = simulateKeyDown("-", 0, "");

      expect(wasBlocked).toBe(false);
    });

    it("blocks minus when value already starts with minus", () => {
      const { simulateKeyDown } = setup({ initialValue: "-123" });

      const { wasBlocked } = simulateKeyDown("-", 0, "-123");

      expect(wasBlocked).toBe(true);
    });

    it("allows digit keys anywhere", () => {
      const { simulateKeyDown } = setup({ initialValue: "123" });

      const { wasBlocked } = simulateKeyDown("5", 1, "123");

      expect(wasBlocked).toBe(false);
    });
  });
});
