import { Button, Typography } from '@ordero/ui';

export default function AttributesPage() {
  return (
    <section className="p-[var(--space-1-25)]">
      <div className="flex items-start justify-between gap-[var(--space-2)]">
        <Typography variant="h5">Attributes list</Typography>
        <Button color="primary" size="m">
          Create Attribute
        </Button>
      </div>
    </section>
  );
}
