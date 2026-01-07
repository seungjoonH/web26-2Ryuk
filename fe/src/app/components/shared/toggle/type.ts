export interface ToggleProps {
  initialChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export interface LabeledToggleProps {
  name?: string;
  label: string;
  initialChecked?: boolean;
  onChange?: (value: boolean) => void;
  children?: React.ReactNode;
}
