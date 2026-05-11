import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import type { SelectProps } from '@mantine/core';
import FormField from '@platform-ui/primitives/FormField';
import Select from '@platform-ui/primitives/Select';

interface ControlledSelectProps<TFieldValues extends FieldValues> extends Omit<
  SelectProps,
  'name' | 'value' | 'onChange' | 'onBlur' | 'error' | 'label' | 'description' | 'required'
> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  required?: boolean;
}

export function ControlledSelect<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  description,
  required,
  disabled,
  ...selectProps
}: ControlledSelectProps<TFieldValues>) {
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
          <Select
            {...selectProps}
            value={field.value || null}
            onChange={(value) => field.onChange(value)}
            onBlur={field.onBlur}
            disabled={disabled}
          />
        </FormField>
      )}
    />
  );
}
