import { useEffect, useRef } from 'react';
import type { FieldValues, Path } from 'react-hook-form';

interface UseDependentFieldOptions<TFieldValues extends FieldValues> {
  sourceValue: unknown;
  targetFields: Path<TFieldValues>[];
  resetField: (name: Path<TFieldValues>) => void;
}

export function useDependentField<TFieldValues extends FieldValues>({
  sourceValue,
  targetFields,
  resetField,
}: UseDependentFieldOptions<TFieldValues>) {
  const isFirstRender = useRef(true);
  const prevSourceRef = useRef(sourceValue);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevSourceRef.current = sourceValue;
      return;
    }
    if (prevSourceRef.current !== sourceValue) {
      prevSourceRef.current = sourceValue;
      targetFields.forEach((field) => resetField(field));
    }
  }, [sourceValue, targetFields, resetField]);
}
