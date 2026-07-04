import { PageHeader, Typography } from '@ordero/ui';
import { CreateAttributeDialogTrigger } from '../CreateAttributeDialog/CreateAttributeDialogTrigger';

export const AttributesListHeader = () => (
  <PageHeader.Root>
    <PageHeader.Left>
      <Typography variant="h5">Attributes list</Typography>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateAttributeDialogTrigger />
    </PageHeader.Right>
  </PageHeader.Root>
);
