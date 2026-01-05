export interface SearchFormProps {
  placeholder?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
}
