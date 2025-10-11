
export const digitsMap: { [key: string]: ReadonlyArray<string> } = {
  fa: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
};


export const decimalSeparatorMap: { [key: string]: string } = {
  fa: "٫",
};

const allLocalizedDigits = Object.values(digitsMap).flat().join("");
const conversionMap: { [key: string]: string } = {};
for (const locale in digitsMap) {
  digitsMap[locale].forEach((digit, index) => {
    conversionMap[digit] = index.toString();
  });
}
const localizedDigitsRegex = new RegExp(`[${allLocalizedDigits}]`, 'g');

export const convertToEnglishDigits = (str: string): string => {
  if (!str) return "";
  return str.replace(localizedDigitsRegex, (char) => conversionMap[char] || char);
};

export const toLocalizedDigits = (numStr: string, locale: keyof typeof digitsMap): string => {
  if (!numStr || !digitsMap[locale]) return numStr;
  const localeDigits = digitsMap[locale];
  return numStr.replace(/\d/g, (digit) => localeDigits[parseInt(digit, 10)]);
};

export const localizeDecimalSeparator = (numStr: string, locale: keyof typeof decimalSeparatorMap): string => {
  const separator = decimalSeparatorMap[locale];
  if (!separator || !numStr.includes('.')) return numStr;
  return numStr.replace('.', separator);
};

export const groupDigits = (
  numStr: string,
  separatorCount: number,
  separatorChar = ','
): string => {
  if (!numStr || separatorCount <= 0) {
    return numStr;
  }
  const regex = new RegExp(`\\B(?=(\\d{${separatorCount}})+(?!\\d))`, 'g');
  return numStr.replace(regex, separatorChar);
};



export const sanitizeNumericInput = (
    value: string | number | null | undefined,
    inputDecimalSeparator: string = '.'
): string => {
    if (value === null || value === undefined) return '';
    let str = String(value);

    str = convertToEnglishDigits(str);

    str = str.replace(/٫/g, '.');

    const standardSeparator = '.';
    if (inputDecimalSeparator && inputDecimalSeparator !== standardSeparator) {
        const escapedSeparator = inputDecimalSeparator.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const sepRegex = new RegExp(escapedSeparator, 'g');
        str = str.replace(sepRegex, standardSeparator);
    }

    const negative = str.startsWith('-');
    str = str.replace(/[^0-9.]/g, '');

    const firstDotIndex = str.indexOf(standardSeparator);
    if (firstDotIndex !== -1) {
        const integerPart = str.substring(0, firstDotIndex);
        const fractionalPart = str.substring(firstDotIndex + 1).replace(/\./g, '');
        str = `${integerPart}${standardSeparator}${fractionalPart}`;
    }

    
    if (negative && str !== '' && str !== standardSeparator) {
        str = `-${str}`;
    }
    let sign = '';
    let numericPart = str;
    if (str.startsWith('-')) {
        sign = '-';
        numericPart = str.substring(1);
    }

    let [intPart, fracPart] = numericPart.split(standardSeparator);

    if (intPart && intPart.length > 1 && intPart.startsWith('0')) {
        intPart = intPart.replace(/^0+/, '');
        if (intPart === '') intPart = '0'; 
    } else if (intPart === '') {

        if (fracPart !== undefined) {
            intPart = '0';
        }
    }

    if (fracPart !== undefined) {
        str = `${sign}${intPart}${standardSeparator}${fracPart}`;
    } else if (intPart !== undefined) {
        str = `${sign}${intPart}`;
        if (value === inputDecimalSeparator && sign === '') {
             str = '.';
        }
         if (value === '-' && sign === '-' && intPart === undefined) {
             str = '-';
         }
    } else if (sign === '-' && value === '-') {
         str = '-';
    } else {
        str = '';
    }


     if (value === '-') return '-';
     if (String(value).endsWith(inputDecimalSeparator) && str === `${sign}${intPart}`) {
         return `${str}${standardSeparator}`;
     }


    return str;
};


export const roundToDecimals = (value: string, maxDecimals?: number): string => {
    if (maxDecimals === undefined || !value || !value.includes('.')) {
        return value;
    }

    const standardSeparator = '.';
    const endsWithSeparator = value.endsWith(standardSeparator);
    let [integerPart, fractionalPart = ''] = value.split(standardSeparator);

    if (maxDecimals <= 0) {
        return integerPart === '' && value.startsWith('-') ? "-0" : (integerPart || "0");
         return integerPart || "0";
    }

    const trimmedFractional = fractionalPart.slice(0, maxDecimals);

    if (trimmedFractional) {
        return `${integerPart}${standardSeparator}${trimmedFractional}`;
    } else {

        if (endsWithSeparator) {
            return `${integerPart}${standardSeparator}`;
        } else {
            return integerPart;
        }
    }
};