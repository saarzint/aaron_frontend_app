import { Input, type InputProps } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { forwardRef } from 'react';

interface GlobalSearchProps extends Omit<InputProps, 'placeholder'> {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

/**
 * Global search component
 * Provides a searchable input in the header
 * Architecture ready for future command palette integration
 */
const GlobalSearch = forwardRef<HTMLInputElement, GlobalSearchProps>(
  ({ onSearch, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onSearch?.(event.currentTarget.value);
    };

    return (
      <Input
        ref={ref}
        placeholder="Search..."
        leftSection={<IconSearch size={16} />}
        size="sm"
        style={{ flex: 1, maxWidth: 300 }}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

GlobalSearch.displayName = 'GlobalSearch';

export default GlobalSearch;
