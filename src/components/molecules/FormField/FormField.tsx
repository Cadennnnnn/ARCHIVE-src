
import type { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({
  id,
  label,
  error,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div className="archive-form-field">
      <label
        htmlFor={id}
        className="form-label small text-uppercase fw-bold"
      >
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      {children}

      {error && (
        <span className="archive-field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
