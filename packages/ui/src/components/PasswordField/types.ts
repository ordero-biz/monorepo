import type { TextFieldProps } from '@/ui/components/TextField';

export type PasswordFieldProps = Omit<
  TextFieldProps,
  'endAdornment' | 'type'
> & {
  defaultVisible?: boolean;
  hidePasswordLabel?: string;
  showPasswordLabel?: string;
};
