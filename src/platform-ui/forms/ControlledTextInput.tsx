import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import type { TextInputProps } from '@mantine/core';
import FormField from '@platform-ui/primitives/FormField';
import Input from '@platform-ui/primitives/Input';

interface ControlledTextInputProps<TFieldValues extends FieldValues> extends Omit<
  TextInputProps,
  'name' | 'value' | 'onChange' | 'onBlur' | 'error' | 'label' | 'description' | 'required'
> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  required?: boolean;
}

export function ControlledTextInput<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  description,
  required,
  disabled,
  ...inputProps
}: ControlledTextInputProps<TFieldValues>) {
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
          <Input {...field} value={field.value ?? ''} disabled={disabled} {...inputProps} />
        </FormField>
      )}
    />
  );
}
