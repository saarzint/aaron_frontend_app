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
  ControlledCheckbox,
  ControlledAutocomplete,
  useDependentField,
  emailField,
} from '@platform-ui/forms';

interface CustomerFormValues {
  name: string;
  email: string;
  company: string;
  status: string;
  phone: string;
  notes: string;
  canContact: boolean;
}

interface CustomerSeed {
  id?: string;
  name: string;
  email: string;
  company: string;
  status: string;
}

interface CustomerFormModalProps {
  opened: boolean;
  onClose: () => void;
  customer?: CustomerSeed;
}

const COMPANY_SUGGESTIONS = [
  'Acme Corp',
  'Globex Industries',
  'Initech',
  'Umbrella Corporation',
  'Stark Industries',
  'Wayne Enterprises',
  'Oscorp',
  'Weyland-Yutani',
];

async function searchCompanies(query: string): Promise<string[]> {
  await new Promise<void>((r) => setTimeout(r, 200));
  return COMPANY_SUGGESTIONS.filter((c) => c.toLowerCase().includes(query.toLowerCase()));
}

export default function CustomerFormModal({ opened, onClose, customer }: CustomerFormModalProps) {
  const { t } = useTranslation('customers');
  const { t: tCommon } = useTranslation('common');
  const queryClient = useQueryClient();
  const { invalidateTenantQueries } = useTenantQueryClient();

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, t('form.errors.nameRequired')),
        email: emailField(t('form.errors.emailRequired'), t('form.errors.emailInvalid')),
        company: z.string().min(1, t('form.errors.companyRequired')),
        status: z.string().min(1, t('form.errors.statusRequired')),
        phone: z.string(),
        notes: z.string(),
        canContact: z.boolean(),
      }),
    [t]
  );

  const defaultValues: CustomerFormValues = customer
    ? { ...customer, phone: '', notes: '', canContact: false }
    : { name: '', email: '', company: '', status: '', phone: '', notes: '', canContact: false };

  const form = useAppForm<CustomerFormValues>({ schema, defaultValues });
  const {
    formState: { isSubmitting, isDirty },
    resetField,
    reset,
    watch,
  } = form;

  const statusValue = watch('status');

  useDependentField<CustomerFormValues>({
    sourceValue: statusValue,
    targetFields: ['canContact'],
    resetField,
  });

  const handleClose = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(tCommon('unsavedChanges.prompt'));
      if (!confirmLeave) return;
    }

    reset(defaultValues);
    onClose();
  };

  const onSubmit = async (data: CustomerFormValues) => {
    if (customer?.id) {
      await apiClient.put(`/customers/${customer.id}`, data);
    } else {
      await apiClient.post('/customers', data);
    }

    await queryClient.invalidateQueries({
      predicate: (query) => Array.isArray(query.queryKey) && query.queryKey.includes('customers'),
    });
    await invalidateTenantQueries(['customers']);
    toast.success({ message: customer ? t('form.updated') : t('form.created') });
    reset(defaultValues);
    onClose();
  };

  const statusOptions = [
    { value: 'active', label: t('form.status.active') },
    { value: 'inactive', label: t('form.status.inactive') },
    { value: 'pending', label: t('form.status.pending') },
  ];

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={customer ? t('form.editTitle') : t('form.addTitle')}
      size="md"
    >
      <Form form={form} onSubmit={onSubmit}>
        <Stack gap="md">
          <FormSection title={t('form.sections.details')}>
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
              <ControlledAutocomplete
                name="company"
                control={form.control}
                label={t('columns.company')}
                placeholder={t('form.companySearch')}
                data={COMPANY_SUGGESTIONS}
                onSearch={searchCompanies}
                required
              />
              <ControlledSelect
                name="status"
                control={form.control}
                label={t('columns.status')}
                data={statusOptions}
                required
              />
            </Stack>
          </FormSection>

          <FormSection title={t('form.sections.contact')} withDivider>
            <Stack gap="sm">
              <ControlledTextInput
                name="phone"
                control={form.control}
                label={t('form.phone')}
                placeholder="+1 555 000 0000"
              />
              {statusValue === 'active' && (
                <ControlledCheckbox
                  name="canContact"
                  control={form.control}
                  label={t('form.canContact')}
                />
              )}
              <ControlledTextarea
                name="notes"
                control={form.control}
                label={t('form.notes')}
                placeholder={t('form.notesPlaceholder')}
                minRows={3}
              />
            </Stack>
          </FormSection>

          <FormActions
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            onCancel={handleClose}
            submitLabel={customer ? t('form.update') : t('form.create')}
          />
        </Stack>
      </Form>
    </Modal>
  );
}
