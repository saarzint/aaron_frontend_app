import type { FieldValues, UseFormReturn, SubmitHandler } from 'react-hook-form';
import type { FormHTMLAttributes, ReactNode } from 'react';

interface FormProps<TFieldValues extends FieldValues> extends Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'onSubmit'
> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  children: ReactNode;
}

export function Form<TFieldValues extends FieldValues>({
  form,
  onSubmit,
  children,
  ...props
}: FormProps<TFieldValues>) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate {...props}>
      {children}
    </form>
  );
}
