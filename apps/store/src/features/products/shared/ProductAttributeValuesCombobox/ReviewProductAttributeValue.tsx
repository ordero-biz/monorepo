import { Button, Chip, Dialog, Skeleton, Typography } from '@ordero/ui';
import { SquareArrowOutUpRight } from 'lucide-react';
import { getAttributeDetailRoute } from '@/lib/client/routes';
import {
  ATTRIBUTE_STATUS,
  ATTRIBUTE_VALUE_STATUS,
} from '@/lib/domain/attributes/constants';
import { getApiErrorMessage } from '@/lib/utils/apiError';
import { useReviewProductAttributeValue } from './hooks/useReviewProductAttributeValue';
import type { ReviewProductAttributeValueProps } from './types';

export const ReviewProductAttributeValue = ({
  attribute,
  attributeValue,
  onSelect,
  onBusyChange,
}: ReviewProductAttributeValueProps) => {
  const { attributeQuery, attributeValuesQuery, activateAttributeValue } =
    useReviewProductAttributeValue(attribute.id, attributeValue.id);
  const currentAttribute = attributeQuery.data;
  const currentValue = attributeValuesQuery.data?.find(
    (value) => value.id === attributeValue.id
  );
  const isFetching =
    attributeQuery.isFetching || attributeValuesQuery.isFetching;
  const queryError = attributeQuery.error ?? attributeValuesQuery.error;
  const isActive = currentValue?.status === ATTRIBUTE_VALUE_STATUS.ACTIVE;
  const isParentActive = currentAttribute?.status === ATTRIBUTE_STATUS.ACTIVE;
  const canSelect = !isFetching && !queryError && isParentActive && isActive;
  const canActivate =
    !isFetching &&
    !queryError &&
    isParentActive &&
    currentValue?.status === ATTRIBUTE_VALUE_STATUS.DRAFT;
  const isMissingValue = attributeValuesQuery.isSuccess && !currentValue;

  const activateAndSelect = async () => {
    onBusyChange(true);
    try {
      const activatedValue = await activateAttributeValue.mutateAsync();
      onSelect(activatedValue);
    } catch {
      // Keep the review open; the mutation error is displayed below.
    } finally {
      onBusyChange(false);
    }
  };

  const handleSelectValue = async () => {
    if (canSelect && currentValue) {
      onSelect(currentValue);
    } else if (canActivate) {
      await activateAndSelect();
    }
  };

  const handleRetry = () => {
    return Promise.all([
      attributeQuery.refetch(),
      attributeValuesQuery.refetch(),
    ]);
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>
          {isActive ? 'Select attribute value' : 'Activate attribute value?'}
        </Dialog.Title>
      </Dialog.Header>
      <Dialog.Content scrollable>
        <div className="flex flex-col gap-[var(--space-2)]">
          {isFetching ? (
            <output className="sr-only">Loading value details</output>
          ) : null}
          <section
            aria-label="Attribute value details"
            aria-busy={isFetching}
            className="min-h-[var(--space-3)]"
          >
            {queryError ? (
              <div role="alert">
                <p>{getApiErrorMessage(queryError)}</p>
                <Button
                  type="button"
                  variant="text"
                  disabled={isFetching}
                  onClick={handleRetry}
                >
                  Try again
                </Button>
              </div>
            ) : !currentAttribute || !attributeValuesQuery.data ? (
              <div className="flex flex-wrap items-center gap-[var(--space-1)]">
                <Skeleton>{attribute.name}</Skeleton>
                <Skeleton>
                  <strong>{attributeValue.name}</strong>
                </Skeleton>
                <Skeleton>
                  <Chip size="s" variant="soft">
                    Draft
                  </Chip>
                </Skeleton>
              </div>
            ) : isMissingValue ? (
              <p role="alert">
                This value is no longer available. Close this review and choose
                another value.
              </p>
            ) : currentValue ? (
              <div className="flex flex-wrap items-center gap-[var(--space-1)]">
                <Typography variant="body2" color="text-secondary">
                  {currentAttribute.name}
                </Typography>
                <span aria-hidden="true" className="text-muted-foreground">
                  ›
                </span>
                <strong className="min-w-0 break-words">
                  {currentValue.name}
                </strong>
                {currentValue.status === ATTRIBUTE_VALUE_STATUS.DRAFT ? (
                  <Chip size="s" variant="soft">
                    Draft
                  </Chip>
                ) : null}
              </div>
            ) : null}
          </section>
          <Dialog.Description>
            {isActive
              ? 'This value is active and can be selected when its attribute is active.'
              : 'Activate this value to use it for this product.'}
          </Dialog.Description>
          <div className="flex flex-col gap-[var(--space-0-5)] rounded-[var(--radius)] bg-muted p-[var(--space-1-5)]">
            <Typography variant="body2">
              <strong>
                {isActive
                  ? 'This value can no longer be edited.'
                  : 'You won’t be able to edit it afterward.'}
              </strong>
            </Typography>
            <Typography variant="body2">
              Activation is permanent across your catalog, even if you cancel
              product creation. Other values stay unchanged.
            </Typography>
          </div>
          {!queryError && currentAttribute && !isParentActive ? (
            <p role="alert">
              Activate the attribute before using this value. Open attribute
              details to review it.
            </p>
          ) : null}
          {!queryError && currentValue && !currentValue.status ? (
            <p role="alert">
              Value status is unavailable. Check attribute details before
              continuing.
            </p>
          ) : null}
          {activateAttributeValue.isError ? (
            <p role="alert">
              {getApiErrorMessage(activateAttributeValue.error)}
            </p>
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
        <Dialog.Close disabled={activateAttributeValue.isPending}>
          Cancel
        </Dialog.Close>
        <Button
          type="button"
          color="primary"
          disabled={
            activateAttributeValue.isPending || (!canSelect && !canActivate)
          }
          onClick={handleSelectValue}
        >
          {activateAttributeValue.isPending
            ? 'Activating...'
            : isActive
              ? 'Select value'
              : 'Activate and select'}
        </Button>
      </Dialog.Footer>
    </>
  );
};
