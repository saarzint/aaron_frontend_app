import { Center, Loader, Stack, Text } from '@mantine/core';
import Typography from '@platform-ui/primitives/Typography';

interface Props {
  title?: string;
  description?: string;
}

export default function LoadingState({ title = 'Loading', description }: Props) {
  return (
    <Center py="xl">
      <Stack align="center" gap="xs">
        <Loader color="brand" />
        <Typography variant="heading">{title}</Typography>
        {description && (
          <Text size="sm" c="neutral.6">
            {description}
          </Text>
        )}
      </Stack>
    </Center>
  );
}
