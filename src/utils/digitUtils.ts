export const digitsMap: { [key: string]: string[] } = {
  fa: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
  in: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
};

export const toLocalizedDigits = (numStr: string, locale: "fa" | "in") => {
  const digits = digitsMap[locale];
  return numStr.replace(/\d/g, (digit) => digits[parseInt(digit)]);
};

export const groupDigits = (
  numStr: string,
  separatorCount: number,
  separatorChar = ","
) => {
  if (separatorCount && separatorCount > 0) {
    return numStr.replace(
      new RegExp(`\\B(?=(\\d{${separatorCount}})+(?!\\d))`, "g"),
      separatorChar
    );
  }
  return numStr;
};

export const convertToEnglishDigits = (str: string) => {
  const map: { [key: string]: string } = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
    "०": "0",
    "१": "1",
    "२": "2",
    "३": "3",
    "४": "4",
    "५": "5",
    "६": "6",
    "७": "7",
    "८": "8",
    "९": "9",
  };
  return str.replace(/[۰-۹०-९]/g, (char) => map[char]);
};
