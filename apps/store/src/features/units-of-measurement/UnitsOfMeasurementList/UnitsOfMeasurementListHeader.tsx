import { PageHeader, Typography } from '@ordero/ui';
import { CreateUnitOfMeasurementDialog } from '../CreateUnitOfMeasurementDialog/CreateUnitOfMeasurementDialog';

export const UnitsOfMeasurementListHeader = () => (
  <PageHeader.Root>
    <PageHeader.Left>
      <Typography variant="h5">Units of measurement list</Typography>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateUnitOfMeasurementDialog />
    </PageHeader.Right>
  </PageHeader.Root>
);
