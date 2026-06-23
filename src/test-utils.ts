import type { ChangeEvent, FocusEvent } from "react";

export function createChangeEvent(
  overrides: { value?: string; selectionStart?: number } = {}
): ChangeEvent<HTMLInputElement> {
  const value = overrides.value ?? "";
  const target = {
    value,
    selectionStart: overrides.selectionStart ?? value.length,
  } as HTMLInputElement;

  return {
    target,
    currentTarget: target,
    bubbles: true,
    cancelable: true,
  } as unknown as ChangeEvent<HTMLInputElement>;
}

export function createFocusEvent(): FocusEvent<HTMLInputElement> {
  const target = {} as HTMLInputElement;
  return {
    target,
    currentTarget: target,
    bubbles: true,
    cancelable: true,
  } as unknown as FocusEvent<HTMLInputElement>;
}
