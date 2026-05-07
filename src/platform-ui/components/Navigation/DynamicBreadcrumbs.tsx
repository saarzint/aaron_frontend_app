import { Breadcrumbs, Text } from '@mantine/core';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Generate breadcrumbs from current pathname
 * Example: /dashboard/admin/orders/123 → Dashboard / Admin / Orders / 123
 */
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [];
  let accumulated = '';

  segments.forEach((segment) => {
    accumulated += `/${segment}`;

    // Skip internal routing segments
    if (segment === 'dashboard') return;

    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({
      label,
      href: accumulated,
    });
  });

  return breadcrumbs;
}

interface DynamicBreadcrumbsProps {
  className?: string;
}

/**
 * Dynamic breadcrumbs component
 * Generates breadcrumbs from current route
 * Supports future customization via route metadata
 */
export default function DynamicBreadcrumbs({ className }: DynamicBreadcrumbsProps) {
  const location = useLocation();
  const breadcrumbs = useMemo(() => generateBreadcrumbs(location.pathname), [location.pathname]);

  if (breadcrumbs.length === 0) return null;

  return (
    <Breadcrumbs className={className}>
      {breadcrumbs.map((item, index) => (
        <Text
          key={`${item.label}-${index}`}
          size="sm"
          c={index === breadcrumbs.length - 1 ? 'brand' : 'neutral.6'}
        >
          {item.label}
        </Text>
      ))}
    </Breadcrumbs>
  );
}
