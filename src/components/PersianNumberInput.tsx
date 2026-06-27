import React, {
  forwardRef,
  useMemo,
  useRef,
  useLayoutEffect,
  useState,
} from "react";
import {
  usePersianNumberInput,
  type UsePersianNumberInputProps,
} from "../hooks/usePersianNumberInput";
import type { TransformNumberOptions } from "../utils/transformNumber";

interface PersianNumberInputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "value" | "min" | "max"
    >,
    Omit<TransformNumberOptions, "maxDecimals"> {
  initialValue?: number | string;
  onValueChange?: (value: string | undefined) => void;
  min?: number;
  max?: number;
  maxDecimals?: number;
}

function mergeRefs<T>(
  ...refs: (React.Ref<T> | null | undefined)[]
): React.RefCallback<T> {
  return (value: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref && typeof ref === "object") {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    }
  };
}

const PersianNumberInput = forwardRef<
  HTMLInputElement,
  PersianNumberInputProps
>((props, ref) => {
  const {
    initialValue,
    separatorCount,
    separatorChar,
    decimalChar,
    suffix,
    locale,
    showZero,
    onValueChange,
    min,
    max,
    maxDecimals,
    onChange: externalOnChange,
    onBlur: externalOnBlur,
    onKeyDown: externalOnKeyDown,
    onPaste: externalOnPaste,
    className,
    style: inputStyle,
    ...rest
  } = props;

  const hookProps: UsePersianNumberInputProps = {
    initialValue,
    separatorCount,
    separatorChar,
    decimalChar,
    suffix,
    locale,
    showZero,
    onValueChange,
    min,
    max,
    maxDecimals,
    onChange: externalOnChange,
    onBlur: externalOnBlur,
    onKeyDown: externalOnKeyDown,
    onPaste: externalOnPaste,
  };

  const { value, onChange, onKeyDown, onPaste, onBlur, inputRef, isInvalid } =
    usePersianNumberInput(hookProps);

  const mergedRef = useMemo(() => mergeRefs(ref, inputRef), [ref, inputRef]);

  const suffixRef = useRef<HTMLSpanElement>(null);
  const [suffixWidth, setSuffixWidth] = useState(0);

  useLayoutEffect(() => {
    if (suffixRef.current) {
      setSuffixWidth(suffixRef.current.offsetWidth);
    } else {
      setSuffixWidth(0);
    }
  }, [suffix]);

  return (
    <div
      className="relative inline-flex items-center w-full"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <input
        ref={mergedRef}
        type="text"
        inputMode="decimal"
        dir="ltr"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onBlur={onBlur}
        aria-invalid={isInvalid || undefined}
        className={className}
        style={{
          ...(suffix && suffixWidth > 0
            ? { paddingRight: suffixWidth + 4 }
            : {}),
          ...(inputStyle || {}),
        }}
        {...rest}
      />
      {suffix && (
        <span
          ref={suffixRef}
          style={{
            position: "absolute",
            pointerEvents: "none",
            right: 0,
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  );
});

PersianNumberInput.displayName = "PersianNumberInput";

export default PersianNumberInput;
