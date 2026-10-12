import { Accordion } from '@ordero/ui';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GeneratedProductVariantCard } from './GeneratedProductVariantCard';
import { useIncrementalProductVariants } from './hooks/useIncrementalProductVariants';
import type { GeneratedProductVariantListProps } from './types';

export const GeneratedProductVariantList = ({
  attributes,
  productVariantsCreationForm,
  invalidVariantIndexes,
  onEditAttributes,
  productVariantCount,
  requireAttributeValueIds,
}: GeneratedProductVariantListProps) => {
  const { hasMoreVariants, loadMoreRef, visibleVariantIndexes } =
    useIncrementalProductVariants({
      productVariantCount,
    });
  const [expandedVariantIds, setExpandedVariantIds] = useState(() =>
    visibleVariantIndexes.map(String)
  );
  const previousVisibleVariantIndexesRef = useRef(
    new Set(visibleVariantIndexes)
  );
  const invalidVariantIndexesSet = useMemo(
    () => new Set(invalidVariantIndexes),
    [invalidVariantIndexes]
  );

  useEffect(() => {
    const previousVisibleVariantIndexes =
      previousVisibleVariantIndexesRef.current;
    const newlyVisibleVariantIndexes = visibleVariantIndexes.filter(
      (variantIndex) => !previousVisibleVariantIndexes.has(variantIndex)
    );

    previousVisibleVariantIndexesRef.current = new Set(visibleVariantIndexes);

    if (newlyVisibleVariantIndexes.length === 0) {
      return;
    }

    setExpandedVariantIds((currentIds) => {
      const nextIds = new Set(currentIds);

      newlyVisibleVariantIndexes.forEach((variantIndex) => {
        nextIds.add(String(variantIndex));
      });

      return nextIds.size === currentIds.length
        ? currentIds
        : Array.from(nextIds);
    });
  }, [visibleVariantIndexes]);

  useEffect(() => {
    if (invalidVariantIndexes.length === 0) {
      return;
    }

    const visibleVariantIndexesSet = new Set(visibleVariantIndexes);
    const visibleInvalidVariantIndexes = invalidVariantIndexes.filter(
      (variantIndex) => visibleVariantIndexesSet.has(variantIndex)
    );

    if (visibleInvalidVariantIndexes.length === 0) {
      return;
    }

    setExpandedVariantIds((currentIds) => {
      const nextIds = new Set(currentIds);

      visibleInvalidVariantIndexes.forEach((variantIndex) => {
        nextIds.add(String(variantIndex));
      });

      return nextIds.size === currentIds.length
        ? currentIds
        : Array.from(nextIds);
    });
  }, [invalidVariantIndexes, visibleVariantIndexes]);

  return (
    <Accordion.Root
      aria-label="Generated product variants"
      multiple
      onValueChange={setExpandedVariantIds}
      value={expandedVariantIds}
    >
      {visibleVariantIndexes.map((variantIndex) => (
        <GeneratedProductVariantCard
          attributes={attributes}
          hasErrors={invalidVariantIndexesSet.has(variantIndex)}
          productVariantsCreationForm={productVariantsCreationForm}
          key={variantIndex}
          onEditAttributes={onEditAttributes}
          requireAttributeValueIds={requireAttributeValueIds}
          variantIndex={variantIndex}
        />
      ))}
      {hasMoreVariants ? (
        <div aria-hidden="true" className="h-px" ref={loadMoreRef} />
      ) : null}
    </Accordion.Root>
  );
};
