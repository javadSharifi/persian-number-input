import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import PersianNumberInput from "./PersianNumberInput";

describe("PersianNumberInput", () => {
  describe("rendering", () => {
    it("renders an input element", () => {
      render(<PersianNumberInput />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("has type=text", () => {
      render(<PersianNumberInput />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "text");
    });

    it("has inputMode=decimal", () => {
      render(<PersianNumberInput />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("inputMode", "decimal");
    });

    it("has dir=ltr", () => {
      render(<PersianNumberInput />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("dir", "ltr");
    });

    it("renders with empty value by default", () => {
      render(<PersianNumberInput />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("");
    });

    it("renders with initialValue", () => {
      render(<PersianNumberInput initialValue={1234} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("۱,۲۳۴");
    });

    it("renders with string initialValue", () => {
      render(<PersianNumberInput initialValue="5678.9" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("۵,۶۷۸٫۹");
    });
  });

  describe("props forwarding", () => {
    it("forwards placeholder prop", () => {
      render(<PersianNumberInput placeholder="Enter number" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("placeholder", "Enter number");
    });

    it("forwards disabled prop", () => {
      render(<PersianNumberInput disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("forwards className prop", () => {
      render(<PersianNumberInput className="my-class" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("my-class");
    });

    it("forwards id prop", () => {
      render(<PersianNumberInput id="my-input" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id", "my-input");
    });

    it("forwards style prop", () => {
      render(<PersianNumberInput style={{ color: "red" }} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveStyle({ color: "rgb(255, 0, 0)" });
    });

    it("forwards autoFocus prop", () => {
      render(<PersianNumberInput autoFocus />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveFocus();
    });
  });

  describe("onChange", () => {
    it("updates display on input", () => {
      render(<PersianNumberInput />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "1234" } });

      expect(input).toHaveValue("۱,۲۳۴");
    });

    it("handles Persian digits input", () => {
      render(<PersianNumberInput />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "۱۲۳۴" } });

      expect(input).toHaveValue("۱,۲۳۴");
    });

    it("handles Arabic digits input", () => {
      render(<PersianNumberInput />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "١٢٣٤" } });

      expect(input).toHaveValue("۱,۲۳۴");
    });

    it("handles decimal input", () => {
      render(<PersianNumberInput />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "12.34" } });

      expect(input).toHaveValue("۱۲٫۳۴");
    });

    it("handles clearing input", () => {
      render(<PersianNumberInput initialValue={1234} />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "" } });

      expect(input).toHaveValue("");
    });

    it("handles typing with trailing dot", () => {
      render(<PersianNumberInput />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "12." } });

      expect(input).toHaveValue("۱۲٫");
    });
  });

  describe("onValueChange", () => {
    it("calls onValueChange with raw value", () => {
      const onValueChange = vi.fn();
      render(<PersianNumberInput onValueChange={onValueChange} />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "1234" } });

      expect(onValueChange).toHaveBeenCalledWith("1234");
    });

    it("calls onValueChange when cleared", () => {
      const onValueChange = vi.fn();
      render(
        <PersianNumberInput initialValue={1234} onValueChange={onValueChange} />
      );
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "" } });

      expect(onValueChange).toHaveBeenCalledWith("");
    });
  });

  describe("max validation", () => {
    it("blocks input above max", () => {
      render(<PersianNumberInput max={100} />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "150" } });

      expect(input).toHaveValue("");
    });

    it("allows input at max", () => {
      render(<PersianNumberInput max={100} />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "100" } });

      expect(input).toHaveValue("۱۰۰");
    });

    it("allows input below max", () => {
      render(<PersianNumberInput max={100} />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "50" } });

      expect(input).toHaveValue("۵۰");
    });
  });

  describe("min validation (onBlur)", () => {
    it("clamps to min on blur", () => {
      render(<PersianNumberInput initialValue={5} min={10} />);
      const input = screen.getByRole("textbox");

      fireEvent.blur(input);

      expect(input).toHaveValue("۱۰");
    });

    it("does not change value above min on blur", () => {
      render(<PersianNumberInput initialValue={50} min={10} />);
      const input = screen.getByRole("textbox");

      fireEvent.blur(input);

      expect(input).toHaveValue("۵۰");
    });
  });

  describe("maxDecimals", () => {
    it("truncates decimals to maxDecimals", () => {
      render(<PersianNumberInput maxDecimals={2} />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "12.3456" } });

      expect(input).toHaveValue("۱۲٫۳۴");
    });
  });

  describe("suffix", () => {
    it("displays suffix", () => {
      render(<PersianNumberInput suffix="متر" />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "1234" } });

      expect(input).toHaveValue("۱,۲۳۴ متر");
    });
  });

  describe("locale", () => {
    it("formats with English locale", () => {
      render(<PersianNumberInput locale="en" />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "1234" } });

      expect(input).toHaveValue("1,234");
    });

    it("keeps dot as decimal separator with English locale", () => {
      render(<PersianNumberInput locale="en" />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "12.34" } });

      expect(input).toHaveValue("12.34");
    });
  });

  describe("separator customization", () => {
    it("uses custom separatorChar", () => {
      render(<PersianNumberInput separatorChar="/" />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "1000000" } });

      expect(input).toHaveValue("۱/۰۰۰/۰۰۰");
    });

    it("uses custom separatorCount", () => {
      render(<PersianNumberInput separatorCount={2} />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "10000" } });

      expect(input).toHaveValue("۱,۰۰,۰۰");
    });
  });

  describe("showZero", () => {
    it("shows zero when showZero is true and input is empty", () => {
      render(<PersianNumberInput showZero />);
      const input = screen.getByRole("textbox");

      expect(input).toHaveValue("۰");
    });

    it("shows zero with suffix", () => {
      render(<PersianNumberInput showZero suffix="ریال" />);
      const input = screen.getByRole("textbox");

      expect(input).toHaveValue("۰ ریال");
    });
  });

  describe("edge cases", () => {
    it("handles negative numbers", () => {
      render(<PersianNumberInput />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "-1234" } });

      expect(input).toHaveValue("-۱,۲۳۴");
    });

    it("handles very large numbers", () => {
      render(<PersianNumberInput />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "999999999" } });

      expect(input).toHaveValue("۹۹۹,۹۹۹,۹۹۹");
    });

    it("handles multiple rapid changes", () => {
      render(<PersianNumberInput />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "123" } });
      fireEvent.change(input, { target: { value: "1234" } });
      fireEvent.change(input, { target: { value: "12345" } });
      fireEvent.change(input, { target: { value: "1234" } });
      fireEvent.change(input, { target: { value: "123" } });

      expect(input).toHaveValue("۱۲۳");
    });

    it("handles typing then clearing", () => {
      render(<PersianNumberInput />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "1234" } });
      expect(input).toHaveValue("۱,۲۳۴");

      fireEvent.change(input, { target: { value: "" } });
      expect(input).toHaveValue("");
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to input element", () => {
      const ref = vi.fn();
      render(<PersianNumberInput ref={ref} />);
      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe("onBlur callback", () => {
    it("calls external onBlur", () => {
      const onBlur = vi.fn();
      render(<PersianNumberInput onBlur={onBlur} />);
      const input = screen.getByRole("textbox");

      fireEvent.blur(input);

      expect(onBlur).toHaveBeenCalled();
    });
  });

  describe("RTL/LTR direction handling", () => {
    it("forces dir=ltr even when dir=rtl is passed", () => {
      render(<PersianNumberInput dir="rtl" />);
      const input = screen.getByRole("textbox");

      expect(input).toHaveAttribute("dir", "ltr");
    });

    it("maintains correct input behavior with ltr direction - typing", () => {
      render(<PersianNumberInput />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "1234" } });

      expect(input).toHaveValue("۱,۲۳۴");
    });

    it("maintains correct input behavior with ltr direction - deleting last character", () => {
      render(<PersianNumberInput initialValue={12345} />);
      const input = screen.getByRole("textbox");

      expect(input).toHaveValue("۱۲,۳۴۵");

      fireEvent.change(input, { target: { value: "۱۲,۳۴" } });

      expect(input).toHaveValue("۱,۲۳۴");
      expect(input).toHaveAttribute("dir", "ltr");
    });

    it("maintains correct input behavior with ltr direction - deleting first character", () => {
      render(<PersianNumberInput initialValue={12345} />);
      const input = screen.getByRole("textbox");

      expect(input).toHaveValue("۱۲,۳۴۵");

      fireEvent.change(input, { target: { value: "۲,۳۴۵" } });

      expect(input).toHaveValue("۲,۳۴۵");
    });

    it("maintains correct input behavior with ltr direction - deleting middle character", () => {
      render(<PersianNumberInput initialValue={123456} />);
      const input = screen.getByRole("textbox");

      expect(input).toHaveValue("۱۲۳,۴۵۶");

      fireEvent.change(input, { target: { value: "۱۲۴,۵۶" } });

      expect(input).toHaveValue("۱۲,۴۵۶");
    });

    it("handles decimal deletion correctly in ltr mode", () => {
      render(<PersianNumberInput initialValue="12.34" />);
      const input = screen.getByRole("textbox");

      expect(input).toHaveValue("۱۲٫۳۴");

      fireEvent.change(input, { target: { value: "۱۲" } });

      expect(input).toHaveValue("۱۲");
    });

    it("handles partial decimal deletion correctly in ltr mode", () => {
      render(<PersianNumberInput initialValue="12.34" />);
      const input = screen.getByRole("textbox");

      expect(input).toHaveValue("۱۲٫۳۴");

      fireEvent.change(input, { target: { value: "۱۲٫۳" } });

      expect(input).toHaveValue("۱۲٫۳");
    });

    it("handles suffix deletion correctly in ltr mode", () => {
      render(<PersianNumberInput suffix="متر" />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "1234" } });
      expect(input).toHaveValue("۱,۲۳۴ متر");

      fireEvent.change(input, { target: { value: "۱,۲۳" } });
      expect(input).toHaveValue("۱۲۳ متر");
    });

    it("handles rapid character deletion in ltr mode", () => {
      render(<PersianNumberInput initialValue={1234567} />);
      const input = screen.getByRole("textbox");

      expect(input).toHaveValue("۱,۲۳۴,۵۶۷");

      fireEvent.change(input, { target: { value: "۱,۲۳" } });

      expect(input).toHaveValue("۱۲۳");
    });

    it("handles rapid character addition in ltr mode", () => {
      render(<PersianNumberInput initialValue={123} />);
      const input = screen.getByRole("textbox");

      expect(input).toHaveValue("۱۲۳");

      fireEvent.change(input, { target: { value: "۱,۲۳۴,۵۶۷" } });

      expect(input).toHaveValue("۱,۲۳۴,۵۶۷");
    });

    it("handles mixed Persian/English digits deletion in ltr mode", () => {
      render(<PersianNumberInput />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "۱۲3۴" } });

      expect(input).toHaveValue("۱,۲۳۴");

      fireEvent.change(input, { target: { value: "۱۲۴" } });

      expect(input).toHaveValue("۱۲۴");
    });

    it("handles Arabic digit deletion in ltr mode", () => {
      render(<PersianNumberInput />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "١٢٣٤" } });

      expect(input).toHaveValue("۱,۲۳۴");

      fireEvent.change(input, { target: { value: "١٢٤" } });

      expect(input).toHaveValue("۱۲۴");
    });

    it("handles decimal point deletion from end in ltr mode", () => {
      render(<PersianNumberInput />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "12.34" } });
      expect(input).toHaveValue("۱۲٫۳۴");

      fireEvent.change(input, { target: { value: "۱۲." } });
      expect(input).toHaveValue("۱۲٫");
    });

    it("handles decimal point deletion from middle in ltr mode", () => {
      render(<PersianNumberInput initialValue="12.34" />);
      const input = screen.getByRole("textbox");

      expect(input).toHaveValue("۱۲٫۳۴");

      fireEvent.change(input, { target: { value: "۱۲۳۴" } });

      expect(input).toHaveValue("۱,۲۳۴");
    });
  });
});
