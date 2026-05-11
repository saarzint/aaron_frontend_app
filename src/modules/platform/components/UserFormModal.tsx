import { useMemo } from 'react';
import { z } from 'zod';
import { Modal, Stack } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from '@core/toast/toast';
import apiClient from '@core/api/apiClient';
import { useTenantQueryClient } from '@config/queryConfig';
import {
  useAppForm,
  Form,
  FormSection,
  FormActions,
  ControlledTextInput,
  ControlledSelect,
  ControlledTextarea,
  useDependentField,
  emailField,
} from '@platform-ui/forms';

interface UserFormValues {
  name: string;
  email: string;
  role: string;
  status: string;
  adminNote: string;
}

interface UserSeed {
  id?: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface UserFormModalProps {
  opened: boolean;
  onClose: () => void;
  user?: UserSeed;
}

const ADMIN_ROLES = ['org_admin', 'super_admin'];

export default function UserFormModal({ opened, onClose, user }: UserFormModalProps) {
  const { t } = useTranslation('users');
  const queryClient = useQueryClient();
  const { invalidateTenantQueries } = useTenantQueryClient();

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, t('form.errors.nameRequired')),
        email: emailField(t('form.errors.emailRequired'), t('form.errors.emailInvalid')),
        role: z.string().min(1, t('form.errors.roleRequired')),
        status: z.string().min(1, t('form.errors.statusRequired')),
        adminNote: z.string(),
      }),
    [t]
  );

  const defaultValues: UserFormValues = user
    ? { ...user, adminNote: '' }
    : { name: '', email: '', role: '', status: '', adminNote: '' };

  const form = useAppForm<UserFormValues>({ schema, defaultValues });
  const {
    formState: { isSubmitting, isDirty },
    resetField,
    reset,
    watch,
  } = form;

  const roleValue = watch('role');

  useDependentField<UserFormValues>({
    sourceValue: roleValue,
    targetFields: ['adminNote'],
    resetField,
  });

  const handleClose = () => {
    if (isDirty) {
      const confirmLeave = window.confirm('You have unsaved changes. Discard them?');
      if (!confirmLeave) return;
    }

    reset(defaultValues);
    onClose();
  };

  const onSubmit = async (data: UserFormValues) => {
    if (user?.id) {
      await apiClient.put(`/users/${user.id}`, data);
    } else {
      await apiClient.post('/users', data);
    }

    await queryClient.invalidateQueries({
      predicate: (query) => Array.isArray(query.queryKey) && query.queryKey.includes('users'),
    });
    await invalidateTenantQueries(['users']);
    toast.success({ message: user ? t('form.updated') : t('form.created') });
    console.info('User saved:', data);
    reset(defaultValues);
    onClose();
  };

  const roleOptions = [
    { value: 'user', label: t('form.roles.user') },
    { value: 'org_admin', label: t('form.roles.org_admin') },
    { value: 'super_admin', label: t('form.roles.super_admin') },
  ];

  const statusOptions = [
    { value: 'active', label: t('form.statuses.active') },
    { value: 'invited', label: t('form.statuses.invited') },
    { value: 'suspended', label: t('form.statuses.suspended') },
  ];

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={user ? t('form.editTitle') : t('form.addTitle')}
      size="md"
    >
      <Form form={form} onSubmit={onSubmit}>
        <Stack gap="md">
          <FormSection title={t('form.sections.identity')}>
            <Stack gap="sm">
              <ControlledTextInput
                name="name"
                control={form.control}
                label={t('columns.name')}
                required
              />
              <ControlledTextInput
                name="email"
                control={form.control}
                label={t('columns.email')}
                type="email"
                required
              />
            </Stack>
          </FormSection>

          <FormSection title={t('form.sections.access')} withDivider>
            <Stack gap="sm">
              <ControlledSelect
                name="role"
                control={form.control}
                label={t('columns.role')}
                data={roleOptions}
                required
              />
              <ControlledSelect
                name="status"
                control={form.control}
                label={t('columns.status')}
                data={statusOptions}
                required
              />
              {ADMIN_ROLES.includes(roleValue) && (
                <ControlledTextarea
                  name="adminNote"
                  control={form.control}
                  label={t('form.adminNote')}
                  placeholder={t('form.adminNotePlaceholder')}
                  description={t('form.sections.access')}
                  minRows={3}
                />
              )}
            </Stack>
          </FormSection>

          <FormActions
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            onCancel={handleClose}
            submitLabel={user ? t('form.update') : t('form.create')}
          />
        </Stack>
      </Form>
    </Modal>
  );
}
