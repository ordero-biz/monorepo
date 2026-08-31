import { Card, PageHeader, Typography } from '@ordero/ui';
import { StoreBreadcrumbs } from '@/features/app-shell';

export const Dashboard = () => (
  <div className="flex flex-col gap-[var(--space-2)]">
    <PageHeader.Root>
      <PageHeader.Left>
        <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
          <Typography variant="h5">Dashboard</Typography>
          <StoreBreadcrumbs items={[{ id: 'dashboard', label: 'Dashboard' }]} />
        </div>
      </PageHeader.Left>
    </PageHeader.Root>

    <Card.Root variant="filled">
      <Card.Content>
        <div className="flex flex-col items-center gap-[var(--space-1)] py-[var(--space-4)] text-center">
          <Typography variant="h6">Coming soon</Typography>
          <Typography color="text-secondary" variant="body2">
            Your dashboard overview is being prepared.
          </Typography>
        </div>
      </Card.Content>
    </Card.Root>
  </div>
);
