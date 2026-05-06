import { Avatar } from '@mantine/core';
import type { AvatarProps } from '@mantine/core';

export default function BrandedAvatar(props: AvatarProps) {
  return <Avatar radius="xl" {...props} />;
}
