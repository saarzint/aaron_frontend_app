import { Alert, Stack, Text } from '@mantine/core';
import Button from '@platform-ui/primitives/Button';
import Typography from '@platform-ui/primitives/Typography';

interface Props {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function ErrorState({
  title = 'Something went wrong',
  message,
  actionLabel,
  onAction,
}: Props) {
  return (
    <Alert color="danger" variant="light">
      <Stack gap="xs">
        <Typography variant="heading">{title}</Typography>
        <Text size="sm">{message}</Text>
        {actionLabel && onAction && (
          <div>
            <Button variant="outline" onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        )}
      </Stack>
    </Alert>
  );
}
