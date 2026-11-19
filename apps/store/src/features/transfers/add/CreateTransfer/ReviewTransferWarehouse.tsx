import { Button, Chip, Dialog, Skeleton, Typography } from '@ordero/ui';
import { SquareArrowOutUpRight } from 'lucide-react';
import { getWarehouseDetailRoute } from '@/lib/client/routes';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { getApiErrorMessage } from '@/lib/utils/apiError';
import { useReviewTransferWarehouse } from './hooks/useReviewTransferWarehouse';
import type { ReviewTransferWarehouseProps } from './types';

export const ReviewTransferWarehouse = ({
  onBusyChange,
  onSelect,
  warehouse,
}: ReviewTransferWarehouseProps) => {
  const { warehouseQuery, publishWarehouse } = useReviewTransferWarehouse(
    warehouse.id
  );
  const currentWarehouse = warehouseQuery.data;
  const displayWarehouse = currentWarehouse ?? warehouse;
  const isActive = currentWarehouse?.status === WAREHOUSE_STATUS.ACTIVE;
  const canSelect =
    !warehouseQuery.isFetching && !warehouseQuery.isError && isActive;
  const canPublish =
    !warehouseQuery.isFetching &&
    !warehouseQuery.isError &&
    currentWarehouse?.status === WAREHOUSE_STATUS.DRAFT;

  const publishAndSelect = async () => {
    onBusyChange(true);
    try {
      const publishedWarehouse = await publishWarehouse.mutateAsync();
      onSelect(publishedWarehouse);
    } catch {
      // Keep the review open so the user can see the mutation error.
    } finally {
      onBusyChange(false);
    }
  };

  const handleSelect = async () => {
    if (canSelect && currentWarehouse) {
      onSelect(currentWarehouse);
    } else if (canPublish) {
      await publishAndSelect();
    }
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>
          {isActive ? 'Select warehouse' : 'Publish warehouse?'}
        </Dialog.Title>
      </Dialog.Header>
      <Dialog.Content scrollable>
        <div className="flex flex-col gap-[var(--space-2)]">
          {warehouseQuery.isFetching ? (
            <output className="sr-only">Loading warehouse details</output>
          ) : null}
          <section
            aria-busy={warehouseQuery.isFetching}
            aria-label="Warehouse details"
            className="flex min-h-[var(--space-7)] items-center sm:min-h-[var(--space-3)]"
          >
            {warehouseQuery.isError ? (
              <div role="alert">
                <p>{getApiErrorMessage(warehouseQuery.error)}</p>
                <Button
                  disabled={warehouseQuery.isFetching}
                  onClick={() => warehouseQuery.refetch()}
                  type="button"
                  variant="text"
                >
                  Try again
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-[var(--space-1)]">
                <Skeleton loading={!currentWarehouse}>
                  <span className="break-words font-semibold">
                    {displayWarehouse.name}
                  </span>
                </Skeleton>
                {displayWarehouse.status === WAREHOUSE_STATUS.DRAFT ? (
                  <Skeleton loading={!currentWarehouse}>
                    <Chip size="s" variant="soft">
                      Draft
                    </Chip>
                  </Skeleton>
                ) : null}
              </div>
            )}
          </section>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Dialog.Description>
              {isActive
                ? 'This warehouse is active and can be selected.'
                : 'Publish this warehouse to use it for this transfer.'}
            </Dialog.Description>
            <div className="flex flex-col gap-[var(--space-0-5)] rounded-[var(--radius)] bg-muted p-[var(--space-1-5)]">
              <Typography variant="body2">
                <strong>
                  {isActive
                    ? 'The warehouse name and status are locked.'
                    : 'Publishing locks the warehouse name and status.'}
                </strong>
              </Typography>
              <Typography variant="body2">
                Publishing is permanent, even if you cancel this transfer. You
                can still update the address and comments.
              </Typography>
            </div>
          </div>
          {publishWarehouse.isError ? (
            <p role="alert">{getApiErrorMessage(publishWarehouse.error)}</p>
          ) : null}
          <Typography variant="body2">
            <a
              className="inline-flex items-center gap-[var(--space-0-5)] text-primary underline"
              href={getWarehouseDetailRoute(warehouse.id)}
              rel="noopener noreferrer"
              target="_blank"
            >
              View warehouse details
              <SquareArrowOutUpRight
                aria-hidden="true"
                className="size-[var(--space-2)] shrink-0"
              />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Typography>
        </div>
      </Dialog.Content>
      <Dialog.Footer
        closeButtonLabel="Cancel"
        closeDisabled={publishWarehouse.isPending}
      >
        <Button
          color="primary"
          disabled={publishWarehouse.isPending || (!canSelect && !canPublish)}
          onClick={handleSelect}
          type="button"
        >
          {publishWarehouse.isPending
            ? 'Publishing...'
            : isActive
              ? 'Select warehouse'
              : 'Publish and select'}
        </Button>
      </Dialog.Footer>
    </>
  );
};
