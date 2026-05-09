import { Anchor, Breadcrumbs, Text } from '@mantine/core';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href: string;
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return [];

  const breadcrumbs: BreadcrumbItem[] = [];
  let accumulated = '';

  for (const segment of segments) {
    accumulated += `/${segment}`;
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    breadcrumbs.push({ label, href: accumulated });
  }

  return breadcrumbs;
}

interface DynamicBreadcrumbsProps {
  className?: string;
}

export default function DynamicBreadcrumbs({ className }: DynamicBreadcrumbsProps) {
  const location = useLocation();
  const breadcrumbs = useMemo(() => generateBreadcrumbs(location.pathname), [location.pathname]);

  if (breadcrumbs.length <= 1) return null;

  return (
    <Breadcrumbs className={className} separator="›">
      {breadcrumbs.map((item, index) =>
        index < breadcrumbs.length - 1 ? (
          <Anchor
            key={item.href}
            component={Link}
            to={item.href}
            size="sm"
            c="dimmed"
            underline="never"
          >
            {item.label}
          </Anchor>
        ) : (
          <Text key={item.href} size="sm" c="brand.6" fw={500}>
            {item.label}
          </Text>
        )
      )}
    </Breadcrumbs>
  );
}
