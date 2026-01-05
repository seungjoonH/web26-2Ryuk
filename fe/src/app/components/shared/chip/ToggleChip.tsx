'use client';

import { useState, useEffect } from 'react';
import CSSUtil from '@/app/utils/css';
import styles from './chip.module.css';
import { ToggleChipProps } from './type';
import { ChipBase } from './Chip';

export default function ToggleChip({
  label,
  size,
  initialChecked = false,
  checked: controlledChecked,
  onChange,
}: ToggleChipProps) {
  const [internalChecked, setInternalChecked] = useState(initialChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  useEffect(() => {
    if (!isControlled) setInternalChecked(initialChecked);
  }, [initialChecked, isControlled]);

  const handleClick = () => {
    const newChecked = !checked;
    if (!isControlled) setInternalChecked(newChecked);
    onChange?.(newChecked);
  };

  const className = CSSUtil.buildCls(styles.toggleChip, checked && styles.checked);

  // checked 상태에 따라 default <-> secondary 자동 전환
  const variant = checked ? 'secondary' : 'default';

  return (
    <div className={className} onClick={handleClick}>
      <ChipBase label={label} size={size} variant={variant} />
    </div>
  );
}
