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
      color: 'success',
      icon: createElement(IconCheck, { size: 16 }),
      autoClose: options.autoClose ?? 4000,
    });
  },

  error(options: ToastOptions) {
    notifications.show({
      title: options.title,
      message: options.message,
      color: 'danger',
      icon: createElement(IconX, { size: 16 }),
      autoClose: options.autoClose ?? 6000,
    });
  },

  warning(options: ToastOptions) {
    notifications.show({
      title: options.title,
      message: options.message,
      color: 'warning',
      icon: createElement(IconAlertTriangle, { size: 16 }),
      autoClose: options.autoClose ?? 5000,
    });
  },

  info(options: ToastOptions) {
    notifications.show({
      title: options.title,
      message: options.message,
      color: 'brand',
      icon: createElement(IconInfoCircle, { size: 16 }),
      autoClose: options.autoClose ?? 4000,
    });
  },
};
