export interface KeyFilterEvent {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

export interface KeyFilterRule {
  pattern?: RegExp;
  key?: string;
  description?: string;
}

export type KeyFilter = (e: KeyFilterEvent) => boolean;

export const createKeyFilter = (rules: KeyFilterRule[]): KeyFilter => {
  return (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return true;
    for (const rule of rules) {
      if (rule.key && e.key === rule.key) return true;
      if (rule.pattern?.test(e.key)) return true;
    }
    return false;
  };
};

export const DEFAULT_NUMERIC_RULES: KeyFilterRule[] = [
  { key: "Backspace" },
  { key: "Delete" },
  { key: "Tab" },
  { key: "Enter" },
  { key: "Home" },
  { key: "End" },
  { pattern: /^Arrow/ },
  { pattern: /^[0-9.\-]$/ },
  { pattern: /^[\u0660-\u0669\u06F0-\u06F9]$/ },
];

export const createNumericKeyFilter = (
  extraRules: KeyFilterRule[] = []
): KeyFilter =>
  createKeyFilter([...DEFAULT_NUMERIC_RULES, ...extraRules]);
