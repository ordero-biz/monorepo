import { PageHeader, Typography } from '@ordero/ui';
import { CreateAttributeDialog } from '../CreateAttributeDialog/CreateAttributeDialog';

export const AttributesListHeader = () => (
  <PageHeader.Root>
    <PageHeader.Left>
      <Typography variant="h5">Attributes list</Typography>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateAttributeDialog />
    </PageHeader.Right>
  </PageHeader.Root>
);
