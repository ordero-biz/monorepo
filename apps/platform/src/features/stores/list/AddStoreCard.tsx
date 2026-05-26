import { Card } from '@ordero/ui';

type AddStoreCardProps = {
  onClick: () => void;
};

export const AddStoreCard = ({ onClick }: AddStoreCardProps) => {
  return (
    <Card.Root variant="filled" onClick={onClick}>
      <Card.Header>
        <div>
          <Card.Title>Add your first store</Card.Title>
          <Card.Description>
            Create a store domain and display name.
          </Card.Description>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="flex min-h-[140px] flex-col items-center justify-center gap-[var(--spacing-1-5)] rounded-[var(--button-radius)] border border-dashed border-[var(--color-divider)] bg-[var(--color-grey-8)] p-[var(--spacing-2)]">
          <span className="inline-flex size-[var(--icon-button-lg-size)] items-center justify-center rounded-[var(--icon-button-radius)] text-primary">
            <span
              className="text-[length:var(--h5-size-desktop)] font-semibold leading-none"
              aria-hidden="true"
            >
              +
            </span>
          </span>
          <span className="text-[length:var(--caption-size-desktop)] font-medium leading-[var(--caption-line-height-desktop)] text-[color:var(--text-secondary)]">
            Add store
          </span>
        </div>
      </Card.Content>
    </Card.Root>
  );
};
