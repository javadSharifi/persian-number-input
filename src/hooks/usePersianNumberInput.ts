import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Decimal from 'decimal.js';
import { transformNumber, TransformNumberOptions } from '../utils/transformNumber';
import { sanitizeNumericInput, roundToDecimals } from '../utils/digitUtils';

const INVALID_RANGE_SIGNAL = Symbol("INVALID_RANGE");

interface UsePersianNumberInputProps extends Omit<TransformNumberOptions, 'maxDecimals'> {
  initialValue?: number | string;
  onValueChange?: (value: string | undefined) => void;
  min?: number;
  max?: number;
  maxDecimals?: number;
  inputDecimalSeparator?: string;
}

interface UsePersianNumberInputReturn {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: (newValue: number | string | undefined) => void;
  rawValue: string | undefined;
}

export const usePersianNumberInput = ({
  initialValue,
  separatorCount = 3,
  separatorChar = ',',
  locale = 'fa',
  showZero = false,
  onValueChange,
  min,
  max,
  maxDecimals,
  inputDecimalSeparator = '.',
}: UsePersianNumberInputProps = {}): UsePersianNumberInputReturn => {

  const getSanitizedRoundedAndCheckedValue = useCallback((val: number | string | undefined): string | undefined | typeof INVALID_RANGE_SIGNAL => {

    if (val === null || val === undefined) return undefined;

    let sanitized = sanitizeNumericInput(String(val), inputDecimalSeparator);

    if (sanitized === '-' || sanitized === '.' || sanitized === '-.') {
    } else if (sanitized) { 
      try {
        const numericValue = new Decimal(sanitized);

        if (min !== undefined && numericValue.lt(min)) {
          console.warn(`Value ${sanitized} is less than min ${min}. Input ignored.`);
          return INVALID_RANGE_SIGNAL; 
        }
        if (max !== undefined && numericValue.gt(max)) {
          console.warn(`Value ${sanitized} exceeds max ${max}. Input ignored.`);
          return INVALID_RANGE_SIGNAL; 
        }

        sanitized = roundToDecimals(sanitized, maxDecimals);

      } catch (error) {
        console.warn(`Error processing sanitized value: ${sanitized}`, error);
        return undefined; 
      }
    } else {
      return undefined;
    }

    if (!showZero) {
        if (sanitized === '-' || sanitized === '.' || sanitized === '-.') {
            return undefined;
        }
        try {
             if (sanitized && new Decimal(sanitized).isZero() && !sanitized.endsWith('.')) {
                 return undefined;
             }
        } catch {}
    }

    return sanitized === '' ? undefined : sanitized;

  }, [inputDecimalSeparator, min, max, maxDecimals, showZero]);


  const [rawValue, setRawValue] = useState<string | undefined>(() => {
      const initialProcessed = getSanitizedRoundedAndCheckedValue(initialValue);
      return initialProcessed === INVALID_RANGE_SIGNAL ? undefined : initialProcessed;
  });


  const displayValue = useMemo(() => {
    const options = { separatorCount, separatorChar, locale, showZero, maxDecimals };
    return transformNumber(rawValue, options);
  }, [rawValue, separatorCount, separatorChar, locale, showZero, maxDecimals]);


  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      const processedValue = getSanitizedRoundedAndCheckedValue(inputValue);

      if (processedValue === INVALID_RANGE_SIGNAL) {
        return;
      }

      if (processedValue !== rawValue) {
        setRawValue(processedValue);
        if (onValueChange) {
          onValueChange(processedValue);
        }
      }
    },
    [rawValue, getSanitizedRoundedAndCheckedValue, onValueChange]
  );

  const handleSetValue = useCallback(
    (newValue: number | string | undefined) => {
      const processedValue = getSanitizedRoundedAndCheckedValue(newValue);

      if (processedValue === INVALID_RANGE_SIGNAL) {
        console.warn(`setValue ignored: Value ${newValue} is out of range [${min}, ${max}].`);
        return;
      }

      if (processedValue !== rawValue) {
        setRawValue(processedValue);
        if (onValueChange) {
          onValueChange(processedValue);
        }
      }
    },
    [rawValue, min, max, getSanitizedRoundedAndCheckedValue, onValueChange] 
  );

  return { value: displayValue, onChange: handleChange, setValue: handleSetValue, rawValue };
};