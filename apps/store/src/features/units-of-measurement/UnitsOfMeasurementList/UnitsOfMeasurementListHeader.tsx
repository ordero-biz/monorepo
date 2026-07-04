import { PageHeader, Typography } from '@ordero/ui';
import { CreateUnitOfMeasurementDialogTrigger } from '../CreateUnitOfMeasurementDialog/CreateUnitOfMeasurementDialogTrigger';

export const UnitsOfMeasurementListHeader = () => (
  <PageHeader.Root>
    <PageHeader.Left>
      <Typography variant="h5">Units of measurement list</Typography>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateUnitOfMeasurementDialogTrigger />
    </PageHeader.Right>
  </PageHeader.Root>
);
