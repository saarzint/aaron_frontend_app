import { useEffect } from 'react';

interface UseDirtyFormOptions {
  warnOnLeave?: boolean;
}

export function useDirtyForm(isDirty: boolean, options: UseDirtyFormOptions = {}) {
  const { warnOnLeave = false } = options;

  useEffect(() => {
    if (!warnOnLeave || !isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty, warnOnLeave]);

  return { isDirty };
}
