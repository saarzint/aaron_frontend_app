import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UseFormProps, FieldValues, Resolver } from 'react-hook-form';
import type { ZodTypeAny } from 'zod';

export interface UseAppFormOptions<TValues extends FieldValues> extends Omit<
  UseFormProps<TValues>,
  'resolver'
> {
  schema?: ZodTypeAny;
}

export function useAppForm<TValues extends FieldValues>({
  schema,
  mode = 'onTouched',
  ...options
}: UseAppFormOptions<TValues>) {
  const resolver = schema
    ? (zodResolver(schema as Parameters<typeof zodResolver>[0]) as unknown as Resolver<TValues>)
    : undefined;

  return useForm<TValues, unknown, TValues>({ ...options, mode, resolver });
}
