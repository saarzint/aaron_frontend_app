import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import type { SwitchProps } from '@mantine/core';
import Switch from '@platform-ui/primitives/Switch';

interface ControlledSwitchProps<TFieldValues extends FieldValues> extends Omit<
  SwitchProps,
  'name' | 'checked' | 'onChange' | 'onBlur'
> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
}

export function ControlledSwitch<TFieldValues extends FieldValues>({
  name,
  control,
  ...switchProps
}: ControlledSwitchProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Switch
          {...switchProps}
          checked={field.value ?? false}
          onChange={(e) => field.onChange(e.currentTarget.checked)}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
