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

function compareNumericStrings(a: string, b: string): number {
  const aNeg = a.startsWith("-");
  const bNeg = b.startsWith("-");

  if (aNeg && !bNeg) return -1;
  if (!aNeg && bNeg) return 1;

  const absA = aNeg ? a.slice(1) : a;
  const absB = bNeg ? b.slice(1) : b;

  const [aInt = "0", aFrac = ""] = absA.split(".");
  const [bInt = "0", bFrac = ""] = absB.split(".");

  if (aInt.length !== bInt.length) {
    const cmp = aInt.length < bInt.length ? -1 : 1;
    return aNeg ? -cmp : cmp;
  }

  for (let i = 0; i < aInt.length; i++) {
    if (aInt[i] < bInt[i]) return aNeg ? 1 : -1;
    if (aInt[i] > bInt[i]) return aNeg ? -1 : 1;
  }

  const maxFracLen = Math.max(aFrac.length, bFrac.length);
  const paddedA = aFrac.padEnd(maxFracLen, "0");
  const paddedB = bFrac.padEnd(maxFracLen, "0");

  for (let i = 0; i < maxFracLen; i++) {
    if (paddedA[i] < paddedB[i]) return aNeg ? 1 : -1;
    if (paddedA[i] > paddedB[i]) return aNeg ? -1 : 1;
  }

  return 0;
}

export const createMaxRule = (
  max?: number,
  timing: ValidationTiming = ValidationTiming.OnChange
): ValidationRule => ({
  timing,
  validate: (rawValue: string) => {
    if (rawValue === "" || rawValue === "." || rawValue === "-" || max === undefined) {
      return { valid: true };
    }
    const maxStr = String(max);
    if (compareNumericStrings(rawValue, maxStr) > 0) {
      if (timing === ValidationTiming.OnBlur) {
        return { valid: false, correctedValue: maxStr };
      }
      return { valid: false };
    }
    return { valid: true };
  },
});

export const createMinRule = (min?: number): ValidationRule => ({
  timing: ValidationTiming.OnBlur,
  validate: (rawValue: string) => {
    if (!rawValue || rawValue === "." || rawValue === "-" || min === undefined) {
      return { valid: true };
    }
    const minStr = String(min);
    if (compareNumericStrings(rawValue, minStr) < 0) {
      return { valid: false, correctedValue: minStr };
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
