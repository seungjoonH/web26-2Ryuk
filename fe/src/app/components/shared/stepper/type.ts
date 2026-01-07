export interface StepperProps {
  initialValue: number;
  suffix?: string;
  minValue?: number;
  maxValue?: number;
  onChange?: (value: number) => void;
}

export interface ParticipantStepperProps {
  initialValue?: number;
  onChange?: (value: number) => void;
}
