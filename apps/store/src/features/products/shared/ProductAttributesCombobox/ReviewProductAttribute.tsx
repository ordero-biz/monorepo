import { Button, Chip, Dialog, Skeleton, Typography } from '@ordero/ui';
import { SquareArrowOutUpRight } from 'lucide-react';
import { getAttributeDetailRoute } from '@/lib/client/routes';
import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';
import { getApiErrorMessage } from '@/lib/utils/apiError';
import { useReviewProductAttribute } from './hooks/useReviewProductAttribute';
import type { ReviewProductAttributeProps } from './types';

export const ReviewProductAttribute = ({
  attribute,
  onSelect,
  onBusyChange,
}: ReviewProductAttributeProps) => {
  const { attributeQuery, attributeValuesQuery, activateAttribute } =
    useReviewProductAttribute(attribute.id);
  const currentAttribute = attributeQuery.data;
  const isFetching =
    attributeQuery.isFetching || attributeValuesQuery.isFetching;
  const queryError = attributeQuery.error ?? attributeValuesQuery.error;
  const hasValues = attributeValuesQuery.data !== undefined;
  const isActive = currentAttribute?.status === ATTRIBUTE_STATUS.ACTIVE;
  const canSelect = !isFetching && !queryError && hasValues && isActive;
  const canActivate =
    !isFetching &&
    !queryError &&
    hasValues &&
    currentAttribute?.status === ATTRIBUTE_STATUS.DRAFT;

  const activateAndSelect = async () => {
    onBusyChange(true);
    try {
      const activatedAttribute = await activateAttribute.mutateAsync();
      onSelect({
        ...activatedAttribute,
        attributeValues: attributeValuesQuery.data ?? [],
      });
    } catch {
      // Keep the review open; the mutation error is displayed below.
    } finally {
      onBusyChange(false);
    }
  };

  const handleSelectAttribute = async () => {
    if (canSelect && currentAttribute) {
      onSelect({
        ...currentAttribute,
        attributeValues: attributeValuesQuery.data ?? [],
      });
    } else if (canActivate) {
      await activateAndSelect();
    }
  };

  const handleRetryAttribute = () => {
    return Promise.all([
      attributeQuery.refetch(),
      attributeValuesQuery.refetch(),
    ]);
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>
          {isActive ? 'Select attribute' : 'Activate attribute?'}
        </Dialog.Title>
      </Dialog.Header>
      <Dialog.Content scrollable>
        <div className="flex flex-col gap-[var(--space-2)]">
          {isFetching ? (
            <output className="sr-only">Loading attribute details</output>
          ) : null}
          <section
            aria-label="Attribute details"
            aria-busy={isFetching}
            className="flex min-h-[var(--space-7)] items-center sm:min-h-[var(--space-3)]"
          >
            {!currentAttribute && !queryError ? (
              <div className="flex w-full flex-wrap items-center gap-[var(--space-1)]">
                <Skeleton>
                  <span className="break-words font-semibold">
                    {attribute.name}
                  </span>
                </Skeleton>
                <Skeleton>
                  <Chip size="s" variant="soft">
                    Draft
                  </Chip>
                </Skeleton>
              </div>
            ) : queryError ? (
              <div role="alert">
                <p>{getApiErrorMessage(queryError)}</p>
                <Button
                  type="button"
                  variant="text"
                  disabled={isFetching}
                  onClick={handleRetryAttribute}
                >
                  Try again
                </Button>
              </div>
            ) : currentAttribute ? (
              <div className="flex flex-wrap items-center gap-[var(--space-1)]">
                <span className="min-w-0 break-words font-semibold">
                  {currentAttribute.name}
                </span>
                {currentAttribute.status === ATTRIBUTE_STATUS.DRAFT ? (
                  <Chip size="s" variant="soft">
                    Draft
                  </Chip>
                ) : null}
              </div>
            ) : null}
          </section>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Dialog.Description>
              {isActive
                ? 'This attribute is active and can be selected.'
                : 'Activate this attribute to use it for this product.'}
            </Dialog.Description>
            <div className="flex flex-col gap-[var(--space-0-5)] rounded-[var(--radius)] bg-muted p-[var(--space-1-5)]">
              <Typography variant="body2">
                <strong>
                  {isActive
                    ? 'The attribute name can no longer be edited.'
                    : 'You won’t be able to rename it afterward.'}
                </strong>
              </Typography>
              <Typography variant="body2">
                Activation is permanent across your catalog, even if you cancel
                product creation. You can still add and manage values; their
                statuses stay unchanged.
              </Typography>
            </div>
          </div>
          {activateAttribute.isError ? (
            <p role="alert">{getApiErrorMessage(activateAttribute.error)}</p>
          ) : null}
          <Typography variant="body2">
            <a
              className="inline-flex items-center gap-[var(--space-0-5)] text-primary underline"
              href={getAttributeDetailRoute(attribute.id)}
              target="_blank"
              rel="noopener noreferrer"
            >
              View attribute details
              <SquareArrowOutUpRight
                aria-hidden="true"
                className="size-[var(--space-2)] shrink-0"
              />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Typography>
        </div>
      </Dialog.Content>
      <Dialog.Footer hideCloseButton>
        <Dialog.Close disabled={activateAttribute.isPending}>
          Cancel
        </Dialog.Close>
        <Button
          color="primary"
          disabled={activateAttribute.isPending || (!canSelect && !canActivate)}
          onClick={handleSelectAttribute}
          type="button"
        >
          {activateAttribute.isPending
            ? 'Activating...'
            : isActive
              ? 'Select attribute'
              : 'Activate and select'}
        </Button>
      </Dialog.Footer>
    </>
  );
};
