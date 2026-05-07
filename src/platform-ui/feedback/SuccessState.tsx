import { Alert, Stack, Text } from '@mantine/core';
import Button from '@platform-ui/primitives/Button';
import Typography from '@platform-ui/primitives/Typography';

interface Props {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function SuccessState({ title = 'All set', message, actionLabel, onAction }: Props) {
  return (
    <Alert color="success" variant="light">
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
