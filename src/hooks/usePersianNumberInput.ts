// hooks/usePersianNumberInput.ts
import React, { useState, useCallback, useMemo } from 'react';
import Decimal from 'decimal.js';
import { transformNumber, TransformNumberOptions } from '../utils/transformNumber';
import { sanitizeNumericInput } from '../utils/digitUtils';

interface UsePersianNumberInputProps extends TransformNumberOptions {
  initialValue?: number | string;
  onValueChange?: (value: string | undefined) => void;
  min?: number;
  max?: number;
}

interface UsePersianNumberInputReturn {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: (newValue: number | string | undefined) => void;
  rawValue: string | undefined;
}

// اگر maxDecimals تعریف نشده باشد، اعشار حفظ می‌شود
const roundToDecimals = (value: string, maxDecimals?: number): string => {
  if (!value || !value.includes('.') || maxDecimals == null) return value;
  const [integerPart, fractionalPart] = value.split('.');
  if (maxDecimals === 0) return integerPart;
  const trimmedFractional = fractionalPart.slice(0, maxDecimals);
  return trimmedFractional ? `${integerPart}.${trimmedFractional}` : integerPart;
};

export const usePersianNumberInput = ({
  initialValue,
  separatorCount = 3,
  separatorChar = ',',
  locale = 'fa',
  maxDecimals,           // undefined یعنی نامحدود
  showZero = false,
  onValueChange,
  min,
  max,
}: UsePersianNumberInputProps = {}): UsePersianNumberInputReturn => {
  const [rawValue, setRawValue] = useState<string | undefined>(() => {
    if (initialValue == null) return undefined;
    let sanitized = sanitizeNumericInput(String(initialValue));
    sanitized = roundToDecimals(sanitized, maxDecimals);
    if (sanitized) {
      try {
        const numericValue = new Decimal(sanitized);
        if ((min !== undefined && numericValue.lt(min)) ||
            (max !== undefined && numericValue.gt(max))) {
          return undefined;
        }
      } catch (error) {
        console.warn(`Invalid initial value: ${sanitized}`, error);
        return undefined;
      }
    }
    if (parseFloat(sanitized) === 0 && !showZero && sanitized !== '0') {
      return undefined;
    }
    return sanitized || undefined;
  });

  const displayValue = useMemo(() => {
    const options = { separatorCount, separatorChar, locale, maxDecimals, showZero };
    if (rawValue === undefined) {
      return showZero ? transformNumber('0', options) : '';
    }
    return transformNumber(rawValue, options);
  }, [rawValue, separatorCount, separatorChar, locale, maxDecimals, showZero]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      let sanitizedValue = sanitizeNumericInput(inputValue);
      if (sanitizedValue !== rawValue) {
        sanitizedValue = roundToDecimals(sanitizedValue, maxDecimals);
        let valueToSet: string | undefined = sanitizedValue;
        if (sanitizedValue) {
          try {
            const numericValue = new Decimal(sanitizedValue);
            if ((min !== undefined && numericValue.lt(min)) ||
                (max !== undefined && numericValue.gt(max))) {
              return; // خارج از محدوده
            }
          } catch (error) {
            console.warn(`Invalid input value: ${sanitizedValue}`, error);
            return;
          }
        }
        if (parseFloat(sanitizedValue) === 0 && !showZero && sanitizedValue !== '0.') {
          valueToSet = undefined;
        }
        setRawValue(valueToSet);
        if (onValueChange) onValueChange(valueToSet);
      }
    },
    [rawValue, onValueChange, showZero, min, max, maxDecimals]
  );

  const handleSetValue = useCallback(
    (newValue: number | string | undefined) => {
      if (newValue == null) {
        setRawValue(undefined);
        if (onValueChange) onValueChange(undefined);
        return;
      }
      let sanitizedValue = sanitizeNumericInput(String(newValue));
      sanitizedValue = roundToDecimals(sanitizedValue, maxDecimals);
      if (sanitizedValue) {
        try {
          const numericValue = new Decimal(sanitizedValue);
          if ((min !== undefined && numericValue.lt(min)) ||
              (max !== undefined && numericValue.gt(max))) {
            return;
          }
        } catch (error) {
          console.warn(`Invalid set value: ${sanitizedValue}`, error);
          return;
        }
      }
      const valueToSet =
        parseFloat(sanitizedValue) === 0 && !showZero && sanitizedValue !== '0.'
          ? undefined
          : sanitizedValue;
      setRawValue(valueToSet);
      if (onValueChange) onValueChange(valueToSet);
    },
    [onValueChange, showZero, min, max, maxDecimals]
  );

  return { value: displayValue, onChange: handleChange, setValue: handleSetValue, rawValue };
};
