export type ChipVariant = 'primary' | 'secondary' | 'outline' | 'default';
export type ChipSize = 'small' | 'medium' | 'large';

export interface ChipProps {
  variant: ChipVariant;
  icon?: string;
  label: string;
  size?: ChipSize;
}

export interface ToggleChipProps {
  label: string;
  size: ChipSize;
  initialChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export type StatusChipStatus = 'success' | 'warning' | 'error';

export interface StatusChipProps {
  status: StatusChipStatus;
  label: string;
  size?: ChipSize;
}
