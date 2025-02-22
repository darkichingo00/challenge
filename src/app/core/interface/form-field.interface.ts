// FormField.interface.ts
export interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  value?: any;
  icon?: string;
}
