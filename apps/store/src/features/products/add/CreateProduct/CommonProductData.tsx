import { Button, Card, Typography } from '@ordero/ui';
import { useId } from 'react';
import { useRestoreFocus } from '@/lib/hooks/accessibility/useRestoreFocus';
import { ProductDetailsEditor } from './ProductDetailsEditor';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';
import type { CommonProductDataProps } from './types';

export const CommonProductData = ({
  isEditing,
  onEditingChange,
  values,
  variantCount,
  activeVariantCount,
  editorErrors,
  onApply,
}: CommonProductDataProps) => {
  const id = useId();

  const editButtonRef = useRestoreFocus(isEditing);

  const { name, category, description, status } = values;

  const finishEditing = () => onEditingChange(false);

  return (
    <section aria-labelledby={`${id}-title`}>
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <header className="flex min-h-[var(--space-4)] items-center justify-between gap-[var(--space-2)]">
              <div className="flex flex-wrap items-center gap-[var(--space-1-5)]">
                <Card.Title id={`${id}-title`}>Product details</Card.Title>
                <Typography color="text-secondary" variant="body2">
                  {variantCount} {variantCount === 1 ? 'variant' : 'variants'}
                </Typography>
              </div>
              {isEditing ? (
                <Typography color="text-secondary" variant="body2">
                  Editing
                </Typography>
              ) : (
                <Button
                  aria-controls={`${id}-fields`}
                  aria-expanded={isEditing}
                  color="primary"
                  onClick={() => onEditingChange(true)}
                  ref={editButtonRef}
                  size="s"
                  type="button"
                  variant="text"
                >
                  Edit details
                </Button>
              )}
            </header>
            {!isEditing ? (
              <section
                aria-label="Product summary"
                className="flex flex-wrap items-start gap-[var(--space-2)]"
              >
                <ProductImagePlaceholder />
                <div className="grid min-w-0 flex-1 items-start gap-[var(--space-3)] break-words lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
                  <dl className="flex min-w-0 flex-col gap-[var(--space-2)]">
                    <div className="flex flex-col gap-[var(--space-0-5)]">
                      <dt className="text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-muted-foreground">
                        Product name
                      </dt>
                      <dd>
                        <Typography variant="subtitle1">{name}</Typography>
                      </dd>
                    </div>
                    <div className="flex flex-col gap-[var(--space-0-5)]">
                      <dt className="text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-muted-foreground">
                        Category
                      </dt>
                      <dd>
                        <Typography variant="subtitle2">
                          {category?.name ?? 'No category selected'}
                        </Typography>
                      </dd>
                    </div>
                    <div className="flex flex-col gap-[var(--space-0-5)]">
                      <dt className="text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-muted-foreground">
                        Product status after creation
                      </dt>
                      <dd>
                        <Typography variant="subtitle2">
                          {status === 'ACTIVE' ? 'Active' : 'Draft'}
                        </Typography>
                        <Typography color="text-secondary" variant="caption">
                          {status === 'ACTIVE'
                            ? 'Only active variants can be supplied and sold.'
                            : 'Cannot be supplied or sold. All variants must remain Draft.'}
                        </Typography>
                      </dd>
                    </div>
                  </dl>
                  <dl className="min-w-0">
                    <div className="flex flex-col gap-[var(--space-0-5)]">
                      <dt className="text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-muted-foreground">
                        Description
                      </dt>
                      <dd className="whitespace-pre-wrap text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)]">
                        {description || (
                          <span className="text-muted-foreground">
                            No description added
                          </span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </section>
            ) : null}
            <div hidden={!isEditing} id={`${id}-fields`}>
              {isEditing ? (
                <ProductDetailsEditor
                  activeVariantCount={activeVariantCount}
                  initialValues={values}
                  initialErrors={editorErrors}
                  onApply={onApply}
                  onCancel={finishEditing}
                />
              ) : null}
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    </section>
  );
};
