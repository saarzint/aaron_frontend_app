import { useCallback } from 'react';
import { toast } from './toast';

export function useToast() {
  const success = useCallback((message: string, title?: string) => {
    toast.success({ message, title });
  }, []);

  const error = useCallback((message: string, title?: string) => {
    toast.error({ message, title });
  }, []);

  const warning = useCallback((message: string, title?: string) => {
    toast.warning({ message, title });
  }, []);

  const info = useCallback((message: string, title?: string) => {
    toast.info({ message, title });
  }, []);

  return { success, error, warning, info };
}
