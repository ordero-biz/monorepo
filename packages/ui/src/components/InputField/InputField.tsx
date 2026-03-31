'use client';

import { cn } from '../../lib/utils';
import { Field, FieldContent, FieldError, FieldLabel } from '../Field';
import { Input } from '../Input';

type InputFieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  size?: 'sm' | 'md';
  required?: boolean;
  disabled?: boolean;
  errors?: Array<undefined | false | null | string>;
  className?: string;
  'aria-invalid'?: boolean;
};

export function InputField({
  id,
  name,
  label,
  value,
  size = 'md',
  onBlur,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  errors = [],
  className,
  'aria-invalid': ariaInvalid,
  ...props
}: InputFieldProps) {
  const hasError = ariaInvalid ?? (errors && errors.length > 0);

  return (
    <Field className={cn('gap-2', className)}>
      {/* Label */}
      <FieldLabel htmlFor={id}>
        <span className="flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </span>
      </FieldLabel>

      {/* Input + description/error */}
      <FieldContent>
        <Input
          size={size}
          id={id}
          name={name}
          type={type}
          value={value}
          onBlur={onBlur}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={hasError}
          {...props}
        />

        <FieldError
          errors={errors
            ?.filter(Boolean)
            .map((e) => ({ message: e as string }))}
        />
      </FieldContent>
    </Field>
  );
}
