import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import type { CheckboxProps } from '@mantine/core';
import Checkbox from '@platform-ui/primitives/Checkbox';

interface ControlledCheckboxProps<TFieldValues extends FieldValues> extends Omit<
  CheckboxProps,
  'name' | 'checked' | 'onChange' | 'onBlur'
> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
}

export function ControlledCheckbox<TFieldValues extends FieldValues>({
  name,
  control,
  ...checkboxProps
}: ControlledCheckboxProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Checkbox
          {...checkboxProps}
          checked={field.value ?? false}
          onChange={(e) => field.onChange(e.currentTarget.checked)}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
