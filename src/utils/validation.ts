export enum ValidationTiming {
  OnChange = "onChange",
  OnBlur = "onBlur",
}

export interface ValidationContext {
  min?: number;
  max?: number;
}

export interface ValidationResult {
  valid: boolean;
  correctedValue?: string;
}

export interface ValidationRule {
  timing: ValidationTiming;
  validate: (
    rawValue: string,
    context: ValidationContext
  ) => ValidationResult;
}

export const createMaxRule = (max?: number): ValidationRule => ({
  timing: ValidationTiming.OnChange,
  validate: (rawValue: string) => {
    if (rawValue === "" || rawValue === ".") return { valid: true };
    const num = parseFloat(rawValue);
    if (max !== undefined && !isNaN(num) && num > max) {
      return { valid: false };
    }
    return { valid: true };
  },
});

export const createMinRule = (min?: number): ValidationRule => ({
  timing: ValidationTiming.OnBlur,
  validate: (rawValue: string) => {
    if (rawValue && rawValue !== ".") {
      const num = parseFloat(rawValue);
      if (min !== undefined && !isNaN(num) && num < min) {
        return { valid: false, correctedValue: String(min) };
      }
    }
    return { valid: true };
  },
});

export const createValidationEngine = (rules: ValidationRule[]) => ({
  validate: (timing: ValidationTiming, rawValue: string): ValidationResult => {
    for (const rule of rules) {
      if (rule.timing === timing) {
        const result = rule.validate(rawValue, {});
        if (!result.valid) return result;
      }
    }
    return { valid: true };
  },
});
