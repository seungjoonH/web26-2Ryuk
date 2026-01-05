export type SliderVariant = 'primary' | 'secondary';

export interface SliderProps {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  variant: SliderVariant;
}
