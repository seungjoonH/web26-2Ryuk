'use client';

import Toggle from './Toggle';
import styles from './labeledToggle.module.css';
import { useState } from 'react';
import CSSUtil from '@/utils/css';
import Icon from '@/app/components/shared/icon/Icon';
import { LabeledToggleProps } from './type';

export default function LabeledToggle({
  name,
  label,
  initialChecked = false,
  onChange,
  children,
}: LabeledToggleProps) {
  const [checked, setChecked] = useState(initialChecked);

  const handleChange = (checked: boolean) => {
    setChecked(checked);
    onChange?.(checked);
  };

  const className = CSSUtil.buildCls(styles.labeledToggle, checked && styles.checked);

  return (
    <div className={className}>
      <div className={styles.toggleHeader}>
        {name && (
          <div className={styles.iconWrapper}>
            <Icon name={name} size="medium" />
          </div>
        )}
        <label className={styles.label}>{label}</label>
        <div>
          <Toggle initialChecked={initialChecked} onChange={handleChange} />
        </div>
      </div>
      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
}
