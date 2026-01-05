'use client';

import { useState, ChangeEvent } from 'react';
import styles from './radioButton.module.css';
import CSSUtil from '@/utils/css';
import { RadioButtonProps } from './type';

export default function RadioButton({
  name,
  values,
  initialSelected = 0,
  onChange,
}: RadioButtonProps) {
  const [selected, setSelected] = useState(initialSelected);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(event.target.value, 10);
    setSelected(index);
    onChange?.(index);
  };

  return (
    <div className={styles.radioButtonGroup}>
      {values.map((value, index) => {
        const isSelected = selected === index;
        const className = CSSUtil.buildCls(styles.radioOption, isSelected && styles.selected);

        return (
          <label key={index} className={className}>
            <input
              type="radio"
              name={name}
              value={index}
              checked={isSelected}
              onChange={handleChange}
              className={styles.input}
            />
            <span className={styles.label}>{value}</span>
          </label>
        );
      })}
    </div>
  );
}
