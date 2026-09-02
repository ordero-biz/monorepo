import { PageHeader, Typography } from '@ordero/ui';
import { AppBreadcrumbs } from '@/lib/components/AppBreadcrumbs';
import { attributesRootBreadcrumb } from '../../shared/breadcrumbs';
import { CreateAttributeDialogTrigger } from '../CreateAttribute';

export const AttributesListHeader = () => (
  <PageHeader.Root>
    <PageHeader.Left>
      <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
        <Typography variant="h5">Attributes list</Typography>
        <AppBreadcrumbs
          items={[
            {
              id: attributesRootBreadcrumb.id,
              label: attributesRootBreadcrumb.label,
            },
          ]}
        />
      </div>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateAttributeDialogTrigger />
    </PageHeader.Right>
  </PageHeader.Root>
);
