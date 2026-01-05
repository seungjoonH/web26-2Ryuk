'use client';

import { useState, type ChangeEvent } from 'react';
import CSSUtil from '@/app/utils/css';
import styles from './toggle.module.css';
import { ToggleProps } from './type';

function Toggle({ initialChecked = false, onChange, disabled = false }: ToggleProps) {
  const [checked, setChecked] = useState(initialChecked);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    setChecked(newChecked);
    onChange?.(newChecked);
  };

  const className = CSSUtil.buildCls(
    styles.toggle,
    checked && styles.checked,
    disabled && styles.disabled,
  );

  return (
    <label className={className}>
      <div className={styles.track} />
      <div className={styles.thumb} />
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={styles.input}
      />
    </label>
  );
}

export default Toggle;
