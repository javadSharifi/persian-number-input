import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PersianNumberInput from "./PersianNumberInput";
import "@testing-library/jest-dom";

describe("PersianNumberInput Component", () => {
  it("should not allow typing negative signs", () => {
    render(<PersianNumberInput />);
    const input = screen.getByRole("textbox") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "-500" } });
    expect(input.value).toBe("۵۰۰");
  });

  it("should fix leading zeros on change", () => {
    render(<PersianNumberInput locale="en" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "000123" } });
    expect(input.value).toBe("123");
  });

  it("should show suffix correctly", () => {
    render(<PersianNumberInput suffix="تومان" locale="en" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "2000" } });
    expect(input.value).toBe("2,000 تومان");
  });

  it("should use custom decimal character", () => {
    render(<PersianNumberInput decimalChar="/" locale="en" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "10/5" } });
    expect(input.value).toBe("10/5");
  });
});
