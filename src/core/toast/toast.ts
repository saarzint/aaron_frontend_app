import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react';
import { createElement } from 'react';

interface ToastOptions {
  title?: string;
  message: string;
  autoClose?: number | false;
}

export const toast = {
  success(options: ToastOptions) {
    notifications.show({
      title: options.title,
      message: options.message,
      color: 'teal',
      icon: createElement(IconCheck, { size: 16 }),
      autoClose: options.autoClose ?? 4000,
    });
  },

  error(options: ToastOptions) {
    notifications.show({
      title: options.title ?? 'Error',
      message: options.message,
      color: 'red',
      icon: createElement(IconX, { size: 16 }),
      autoClose: options.autoClose ?? 6000,
    });
  },

  warning(options: ToastOptions) {
    notifications.show({
      title: options.title,
      message: options.message,
      color: 'orange',
      icon: createElement(IconAlertTriangle, { size: 16 }),
      autoClose: options.autoClose ?? 5000,
    });
  },

  info(options: ToastOptions) {
    notifications.show({
      title: options.title,
      message: options.message,
      color: 'blue',
      icon: createElement(IconInfoCircle, { size: 16 }),
      autoClose: options.autoClose ?? 4000,
    });
  },
};
