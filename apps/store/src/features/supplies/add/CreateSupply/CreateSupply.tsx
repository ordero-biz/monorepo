'use client';

import { PageHeader, Typography } from '@ordero/ui';
import { AppBreadcrumbs } from '@/lib/components/AppBreadcrumbs';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import { suppliesRootBreadcrumb } from '../../shared/breadcrumbs';
import { useSupplyEditorForm } from './hooks/useSupplyEditorForm';
import { SupplyEntries } from './SupplyEntries';
import { SupplyInformation } from './SupplyInformation';
import type { CreateSupplyProps } from './types';

export const CreateSupply = ({ initialSupply }: CreateSupplyProps) => {
  const { form, submit, submitIntent } = useSupplyEditorForm(initialSupply);
  const readOnly = initialSupply?.status === SUPPLY_STATUS.COMPLETED;

  return (
    <form
      className="flex flex-col gap-[var(--space-3)]"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (!readOnly) {
          submit('draft');
        }
      }}
    >
      <PageHeader.Root>
        <PageHeader.Left>
          <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
            <Typography variant="h5">
              {initialSupply
                ? initialSupply.supplyNumber || 'Supply'
                : 'Create supply'}
            </Typography>
            <AppBreadcrumbs
              items={[
                suppliesRootBreadcrumb,
                {
                  id: 'current-supply',
                  label: initialSupply?.supplyNumber || 'New supply',
                },
              ]}
            />
          </div>
        </PageHeader.Left>
      </PageHeader.Root>

      <SupplyInformation
        form={form}
        initialSupply={initialSupply}
        readOnly={readOnly}
      />

      <form.Subscribe selector={(state) => state.values.supplyEntries}>
        {(entries) => (
          <SupplyEntries
            entries={entries}
            form={form}
            readOnly={readOnly}
            submit={submit}
            submitIntent={submitIntent}
          />
        )}
      </form.Subscribe>
    </form>
  );
};
