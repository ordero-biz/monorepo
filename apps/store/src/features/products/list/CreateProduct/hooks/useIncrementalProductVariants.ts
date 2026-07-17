import { useEffect, useMemo, useRef, useState } from 'react';
import type { CreateProductVariantValues } from '../types';

const INITIAL_VISIBLE_VARIANTS = 20;
const VISIBLE_VARIANTS_STEP = 20;

export const useIncrementalProductVariants = (
  productVariants: CreateProductVariantValues[]
) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [visibleVariantState, setVisibleVariantState] = useState(() => ({
    productVariants,
    visibleVariantCount: INITIAL_VISIBLE_VARIANTS,
  }));
  const visibleVariantCount =
    visibleVariantState.productVariants === productVariants
      ? visibleVariantState.visibleVariantCount
      : INITIAL_VISIBLE_VARIANTS;
  const visibleProductVariants = useMemo(
    () => productVariants.slice(0, visibleVariantCount),
    [productVariants, visibleVariantCount]
  );
  const hasMoreVariants = visibleVariantCount < productVariants.length;

  useEffect(() => {
    if (visibleVariantState.productVariants === productVariants) {
      return;
    }

    setVisibleVariantState({
      productVariants,
      visibleVariantCount: INITIAL_VISIBLE_VARIANTS,
    });
  }, [productVariants, visibleVariantState.productVariants]);

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;

    if (!loadMoreElement || !hasMoreVariants) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setVisibleVariantState({
        productVariants,
        visibleVariantCount: productVariants.length,
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        setVisibleVariantState((currentState) => {
          const currentCount =
            currentState.productVariants === productVariants
              ? currentState.visibleVariantCount
              : INITIAL_VISIBLE_VARIANTS;

          return {
            productVariants,
            visibleVariantCount: Math.min(
              currentCount + VISIBLE_VARIANTS_STEP,
              productVariants.length
            ),
          };
        });
      },
      {
        rootMargin: '800px 0px',
      }
    );

    observer.observe(loadMoreElement);

    return () => observer.disconnect();
  }, [hasMoreVariants, productVariants]);

  return {
    hasMoreVariants,
    loadMoreRef,
    visibleProductVariants,
  };
};
