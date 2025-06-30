import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { CustomInputRef } from '../types';
import styles from '../index.module.css';

export const CustomInput = forwardRef<
  CustomInputRef,
  { placeholder?: string; onChange?: (value: string) => void }
>(({ placeholder, onChange }, ref) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    clear: () => {
      setValue('');
      onChange?.('');
    },
    getValue: () => value,
    setValue: (newValue: string) => {
      setValue(newValue);
      onChange?.(newValue);
    },
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={styles.customInput}
    />
  );
});

CustomInput.displayName = 'CustomInput';
