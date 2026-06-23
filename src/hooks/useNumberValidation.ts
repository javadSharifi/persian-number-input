import { useMemo, useCallback } from "react";
import {
  ValidationTiming,
  createMaxRule,
  createMinRule,
  createValidationEngine,
  ValidationResult,
} from "../utils/validation";

interface ValidationOptions {
  min?: number;
  max?: number;
}

export const useNumberValidation = (options: ValidationOptions) => {
  const engine = useMemo(
    () =>
      createValidationEngine([
        createMaxRule(options.max),
        createMinRule(options.min),
      ]),
    [options.max, options.min]
  );

  const validateOnChange = useCallback(
    (nextRaw: string): boolean => {
      const result = engine.validate(ValidationTiming.OnChange, nextRaw);
      return result.valid;
    },
    [engine]
  );

  const validateOnBlur = useCallback(
    (rawValue: string): ValidationResult => {
      return engine.validate(ValidationTiming.OnBlur, rawValue);
    },
    [engine]
  );

  return { validateOnChange, validateOnBlur };
};
