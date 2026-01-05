'use client';

import { useState, type ChangeEvent } from 'react';
import CSSUtil from '@/app/utils/css';
import styles from './slider.module.css';
import { SliderProps } from './type';

function SliderBase({
  initialValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  variant,
}: SliderProps) {
  const [value, setValue] = useState(initialValue);
  const percentage = ((value - min) / (max - min)) * 100;
  const style = { '--slider-percentage': `${percentage}%` } as React.CSSProperties;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className={CSSUtil.buildCls(styles.slider, styles[variant])}
      style={style}
    />
  );
}

export function PrimarySlider(props: Omit<SliderProps, 'variant'>) {
  return <SliderBase {...props} variant="primary" />;
}

export function SecondarySlider(props: Omit<SliderProps, 'variant'>) {
  return <SliderBase {...props} variant="secondary" />;
}

export { PrimarySlider as Primary, SecondarySlider as Secondary } from './Slider';
