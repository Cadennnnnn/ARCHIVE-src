

import type { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function FormInput({
  hasError = false,
  className = '',
  ...props
}: FormInputProps) {
  return (
    <input
      {...props}
      className={`form-control rounded-0 py-2 ${hasError ? 'is-invalid' : ''} ${className}`.trim()}
      aria-invalid={hasError}
    />
  );
}