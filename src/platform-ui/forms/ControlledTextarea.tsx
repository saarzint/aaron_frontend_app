import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import type { TextareaProps } from '@mantine/core';
import FormField from '@platform-ui/primitives/FormField';
import Textarea from '@platform-ui/primitives/Textarea';

interface ControlledTextareaProps<TFieldValues extends FieldValues> extends Omit<
  TextareaProps,
  'name' | 'value' | 'onChange' | 'onBlur' | 'error' | 'label' | 'description' | 'required'
> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  required?: boolean;
}

export function ControlledTextarea<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  description,
  required,
  disabled,
  ...textareaProps
}: ControlledTextareaProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField
          label={label}
          error={fieldState.error?.message}
          description={description}
          required={required}
          disabled={disabled}
        >
          <Textarea {...field} value={field.value ?? ''} disabled={disabled} {...textareaProps} />
        </FormField>
      )}
    />
  );
}
