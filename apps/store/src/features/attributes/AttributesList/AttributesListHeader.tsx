import { Typography } from '@/ui/index';
import { CreateAttributeDialog } from '../CreateAttributeDialog/CreateAttributeDialog';

export const AttributesListHeader = () => (
  <div className="p-[var(--space-1-25)]">
    <div className="flex items-start justify-between gap-[var(--space-2)]">
      <Typography variant="h5">Attributes list</Typography>
      <CreateAttributeDialog />
    </div>
  </div>
);
