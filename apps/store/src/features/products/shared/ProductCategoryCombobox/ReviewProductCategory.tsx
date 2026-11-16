import { Button, Chip, Dialog, Skeleton, Typography } from '@ordero/ui';
import { SquareArrowOutUpRight } from 'lucide-react';
import { getCategoryDetailRoute } from '@/lib/client/routes';
import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import { getApiErrorMessage } from '@/lib/utils/apiError';
import { useReviewProductCategory } from './hooks/useReviewProductCategory';
import type { ReviewProductCategoryProps } from './types';

export const ReviewProductCategory = ({
  category,
  onSelect,
  onBusyChange,
}: ReviewProductCategoryProps) => {
  const { categoryQuery, activateCategory } = useReviewProductCategory(
    category.id
  );
  const currentCategory = categoryQuery.data;
  const isActive = currentCategory?.status === CATEGORY_STATUS.ACTIVE;
  const canSelect =
    !categoryQuery.isFetching && !categoryQuery.isError && isActive;
  const canActivate =
    !categoryQuery.isFetching &&
    !categoryQuery.isError &&
    currentCategory?.status === CATEGORY_STATUS.DRAFT;

  const activateAndSelect = async () => {
    onBusyChange(true);
    try {
      const activatedCategory = await activateCategory.mutateAsync();
      onSelect(activatedCategory);
    } catch {
      // Keep the review open; the mutation error is displayed below.
    } finally {
      onBusyChange(false);
    }
  };

  const handleSelectCategory = async () => {
    if (canSelect && currentCategory) {
      onSelect(currentCategory);
    } else if (canActivate) {
      await activateAndSelect();
    }
  };

  const handleRetryCategory = () => {
    return categoryQuery.refetch();
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>
          {isActive ? 'Select category' : 'Activate category?'}
        </Dialog.Title>
      </Dialog.Header>
      <Dialog.Content scrollable>
        <div className="flex flex-col gap-[var(--space-2)]">
          {categoryQuery.isFetching ? (
            <output className="sr-only">Loading category details</output>
          ) : null}
          <section
            aria-label="Category details"
            aria-busy={categoryQuery.isFetching}
            className="flex min-h-[var(--space-7)] items-center sm:min-h-[var(--space-3)]"
          >
            {!currentCategory && !categoryQuery.isError ? (
              <div className="flex w-full flex-wrap items-center gap-[var(--space-1)]">
                <Skeleton width="25%" />
                <Skeleton>
                  <span className="break-words font-semibold">
                    {category.name}
                  </span>
                </Skeleton>
                <Skeleton>
                  <Chip size="s" variant="soft">
                    Draft
                  </Chip>
                </Skeleton>
              </div>
            ) : categoryQuery.isError ? (
              <div role="alert">
                <p>{getApiErrorMessage(categoryQuery.error)}</p>
                <Button
                  type="button"
                  variant="text"
                  disabled={categoryQuery.isFetching}
                  onClick={handleRetryCategory}
                >
                  Try again
                </Button>
              </div>
            ) : currentCategory ? (
              <div className="flex flex-wrap items-center gap-[var(--space-1)]">
                <ol
                  aria-label="Category path"
                  className="flex min-w-0 flex-wrap items-baseline gap-[var(--space-0-5)] break-words"
                >
                  {currentCategory.parentCategory ? (
                    <li className="flex min-w-0 items-baseline gap-[var(--space-0-5)]">
                      <Typography variant="body2" color="text-secondary">
                        {currentCategory.parentCategory.name}
                      </Typography>
                      <span
                        aria-hidden="true"
                        className="text-muted-foreground"
                      >
                        ›
                      </span>
                    </li>
                  ) : null}
                  <li className="min-w-0 font-semibold">
                    {currentCategory.name}
                  </li>
                </ol>
                {currentCategory.status === CATEGORY_STATUS.DRAFT ? (
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
                ? 'This category is active and can be selected.'
                : 'Activate this category to use it for this product.'}
            </Dialog.Description>
            <div className="flex flex-col gap-[var(--space-0-5)] rounded-[var(--radius)] bg-muted p-[var(--space-1-5)]">
              <Typography variant="body2">
                <strong>
                  {isActive
                    ? 'This category can no longer be edited.'
                    : 'You won’t be able to edit it afterward.'}
                </strong>
              </Typography>
              <Typography variant="body2">
                Activation is permanent across your catalog, even if you cancel
                product creation.
              </Typography>
            </div>
          </div>
          {activateCategory.isError ? (
            <p role="alert">{getApiErrorMessage(activateCategory.error)}</p>
          ) : null}
          <Typography variant="body2">
            <a
              className="inline-flex items-center gap-[var(--space-0-5)] text-primary underline"
              href={getCategoryDetailRoute(category.id)}
              target="_blank"
              rel="noopener noreferrer"
            >
              View category details
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
        <Dialog.Close disabled={activateCategory.isPending}>
          Cancel
        </Dialog.Close>
        <Button
          color="primary"
          disabled={activateCategory.isPending || (!canSelect && !canActivate)}
          onClick={handleSelectCategory}
          type="button"
        >
          {activateCategory.isPending
            ? 'Activating...'
            : isActive
              ? 'Select category'
              : 'Activate and select'}
        </Button>
      </Dialog.Footer>
    </>
  );
};
