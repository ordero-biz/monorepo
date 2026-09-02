import { PageHeader, Typography } from '@ordero/ui';
import { StoreBreadcrumbs } from '@/features/app-shell';
import { unitsOfMeasurementRootBreadcrumb } from '../../shared/breadcrumbs';
import { CreateUnitOfMeasurementDialogTrigger } from '../CreateUnitOfMeasurement';

export const UnitsOfMeasurementListHeader = () => (
  <PageHeader.Root>
    <PageHeader.Left>
      <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
        <Typography variant="h5">Units of measurement list</Typography>
        <StoreBreadcrumbs
          items={[
            {
              id: unitsOfMeasurementRootBreadcrumb.id,
              label: unitsOfMeasurementRootBreadcrumb.label,
            },
          ]}
        />
      </div>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateUnitOfMeasurementDialogTrigger />
    </PageHeader.Right>
  </PageHeader.Root>
);
