import { useEffect, useState, useRef } from 'react';
import { Autocomplete, Loader } from '@mantine/core';
import { Controller } from 'react-hook-form';
import type { AutocompleteProps } from '@mantine/core';
import type { Control, FieldValues, Path } from 'react-hook-form';
import FormField from '@platform-ui/primitives/FormField';

interface ControlledAutocompleteProps<TFieldValues extends FieldValues> extends Omit<
  AutocompleteProps,
  | 'name'
  | 'value'
  | 'onChange'
  | 'onBlur'
  | 'data'
  | 'error'
  | 'label'
  | 'description'
  | 'required'
  | 'rightSection'
> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  required?: boolean;
  data?: string[];
  onSearch?: (query: string) => Promise<string[]>;
  debounceMs?: number;
}

export function ControlledAutocomplete<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  description,
  required,
  disabled,
  data = [],
  onSearch,
  debounceMs = 300,
  ...autocompleteProps
}: ControlledAutocompleteProps<TFieldValues>) {
  const [asyncSuggestions, setAsyncSuggestions] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const suggestions = asyncSuggestions ?? data;

  useEffect(() => {
    if (!onSearch) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!searchQuery.trim()) return;

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await onSearch(searchQuery);
        setAsyncSuggestions(results);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, onSearch, debounceMs]);

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
          <Autocomplete
            {...autocompleteProps}
            radius="md"
            value={field.value ?? ''}
            onChange={(value) => {
              field.onChange(value);
              if (!value.trim()) {
                setAsyncSuggestions(null);
                setLoading(false);
              }
              setSearchQuery(value);
            }}
            onBlur={field.onBlur}
            data={suggestions}
            disabled={disabled}
            rightSection={loading ? <Loader size={14} /> : undefined}
          />
        </FormField>
      )}
    />
  );
}
