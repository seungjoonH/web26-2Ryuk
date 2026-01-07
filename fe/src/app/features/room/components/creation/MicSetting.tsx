import LabeledToggle from '@/app/components/shared/toggle/LabeledToggle';

export interface MicSettingProps {
  initialChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function MicSetting({ initialChecked = false, onChange }: MicSettingProps) {
  return (
    <LabeledToggle
      name="mic"
      label="사용 허용"
      initialChecked={initialChecked}
      onChange={onChange}
    />
  );
}
