import React from 'react';
interface PersianNumberInputCustomProps {
    initialValue?: string;
    separatorCount?: number;
    separatorChar?: string;
    lang?: 'fa' | 'in' | 'en';
    onChangeValue?: (englishNumber: string) => void;
}
type AllowedInputProps = Pick<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'style' | 'placeholder' | 'disabled' | 'readOnly' | 'id' | 'name' | 'autoComplete' | 'autoFocus' | 'maxLength' | 'minLength' | 'required' | 'title' | 'dir' | 'onClick' | 'onKeyDown' | 'onKeyUp' | 'onKeyPress' | 'onFocus' | 'onBlur' | 'onMouseDown' | 'onMouseUp' | 'onMouseEnter' | 'onMouseLeave' | 'onTouchStart' | 'onTouchEnd' | 'onPaste'>;
export type PersianNumberInputProps = PersianNumberInputCustomProps & AllowedInputProps;
declare const PersianNumberInput: React.FC<PersianNumberInputProps>;
export default PersianNumberInput;
