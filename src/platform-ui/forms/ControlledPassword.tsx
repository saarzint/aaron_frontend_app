import { PasswordInput } from '@mantine/core';
import { Controller } from 'react-hook-form';
import type { PasswordInputProps } from '@mantine/core';
import type { Control, FieldValues, Path } from 'react-hook-form';
import FormField from '@platform-ui/primitives/FormField';

interface ControlledPasswordProps<TFieldValues extends FieldValues> extends Omit<
  PasswordInputProps,
  'name' | 'value' | 'onChange' | 'onBlur' | 'error' | 'label' | 'description' | 'required'
> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  required?: boolean;
}

export function ControlledPassword<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  description,
  required,
  disabled,
  ...inputProps
}: ControlledPasswordProps<TFieldValues>) {
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
          <PasswordInput
            {...field}
            value={field.value ?? ''}
            disabled={disabled}
            radius="md"
            {...inputProps}
          />
        </FormField>
      )}
    />
  );
}
