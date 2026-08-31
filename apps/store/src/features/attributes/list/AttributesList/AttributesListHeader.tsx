import { PageHeader, Typography } from '@ordero/ui';
import { StoreBreadcrumbs } from '@/features/app-shell';
import { clientRoutes } from '@/lib/client/routes';
import { CreateAttributeDialogTrigger } from '../CreateAttribute';

export const AttributesListHeader = () => (
  <PageHeader.Root>
    <PageHeader.Left>
      <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
        <Typography variant="h5">Attributes list</Typography>
        <StoreBreadcrumbs
          items={[
            {
              href: clientRoutes.products,
              id: 'product',
              label: 'Product',
            },
            { id: 'attributes', label: 'Attributes' },
          ]}
        />
      </div>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateAttributeDialogTrigger />
    </PageHeader.Right>
  </PageHeader.Root>
);
