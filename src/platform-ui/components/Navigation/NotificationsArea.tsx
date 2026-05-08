import { Badge, Group, Popover, Stack, Text, UnstyledButton } from '@mantine/core';
import { IconBell } from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import { mockNotifications, type NotificationMock } from '@mocks/data';

interface NotificationsAreaProps {
  notifications?: NotificationMock[];
  onNotificationClick?: (notificationId: string) => void;
  onDismiss?: (notificationId: string) => void;
}

/**
 * Notifications area component
 * Displays notification bell with dropdown panel
 * Supports unread indicator and mock data
 * Architecture ready for real-time integration
 */
export default function NotificationsArea({
  notifications = [],
  onNotificationClick,
  onDismiss,
}: NotificationsAreaProps) {
  const [opened, setOpened] = useState(false);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;
  const displayUnreadCount = notifications.length > 0 ? unreadCount : 1;

  const handleNotificationClick = (id: string) => {
    onNotificationClick?.(id);
  };

  const handleDismiss = (id: string) => {
    onDismiss?.(id);
  };

  return (
    <Popover position="bottom-end" withArrow>
      <Popover.Target>
        <UnstyledButton
          onClick={() => setOpened(!opened)}
          style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
        >
          <IconBell size={18} />
          {displayUnreadCount > 0 && (
            <Badge
              size="xs"
              variant="filled"
              color="brand"
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                borderRadius: '50%',
              }}
            >
              {displayUnreadCount}
            </Badge>
          )}
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="xs" style={{ width: 300, maxHeight: 400, overflowY: 'auto' }}>
          <Text fw={600} size="sm" px="sm" pt="sm">
            Notifications
          </Text>
          {displayNotifications.length === 0 ? (
            <Text size="sm" c="neutral.5" ta="center" py="md">
              No notifications
            </Text>
          ) : (
            displayNotifications.map((notification) => (
              <UnstyledButton
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 4,
                  backgroundColor: notification.read ? 'transparent' : 'rgba(79, 70, 180, 0.05)',
                  cursor: 'pointer',
                  transition: 'background-color 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(79, 70, 180, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = notification.read
                    ? 'transparent'
                    : 'rgba(79, 70, 180, 0.05)';
                }}
              >
                <Group justify="space-between">
                  <div style={{ flex: 1 }}>
                    <Group gap={4}>
                      <Text size="sm" fw={notification.read ? 400 : 600}>
                        {notification.title}
                      </Text>
                      {!notification.read && <Badge size="xs" variant="dot" color="brand" />}
                    </Group>
                    <Text size="xs" c="neutral.6" mt={4}>
                      {notification.message}
                    </Text>
                    <Text size="xs" c="neutral.5" mt={2}>
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </Text>
                  </div>
                  <UnstyledButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDismiss(notification.id);
                    }}
                    style={{ padding: 0 }}
                  >
                    ✕
                  </UnstyledButton>
                </Group>
              </UnstyledButton>
            ))
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
