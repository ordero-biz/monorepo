import { useEffect, useMemo, useRef, useState } from 'react';

const INITIAL_VISIBLE_VARIANTS = 20;
const VISIBLE_VARIANTS_STEP = 20;

type UseIncrementalProductVariantsArgs = {
  productVariantCount: number;
};

export const useIncrementalProductVariants = ({
  productVariantCount,
}: UseIncrementalProductVariantsArgs) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [visibleVariantCount, setVisibleVariantCount] = useState(() =>
    Math.min(INITIAL_VISIBLE_VARIANTS, productVariantCount)
  );
  const visibleVariantIndexes = useMemo(
    () => Array.from({ length: visibleVariantCount }, (_, index) => index),
    [visibleVariantCount]
  );
  const hasMoreVariants = visibleVariantCount < productVariantCount;

  useEffect(() => {
    setVisibleVariantCount((currentCount) => {
      return Math.min(currentCount, productVariantCount);
    });
  }, [productVariantCount]);

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;

    if (!loadMoreElement || !hasMoreVariants) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setVisibleVariantCount(productVariantCount);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        setVisibleVariantCount((currentCount) =>
          Math.min(currentCount + VISIBLE_VARIANTS_STEP, productVariantCount)
        );
      },
      {
        rootMargin: '800px 0px',
      }
    );

    observer.observe(loadMoreElement);

    return () => observer.disconnect();
  }, [hasMoreVariants, productVariantCount]);

  return {
    hasMoreVariants,
    loadMoreRef,
    visibleVariantIndexes,
  };
};
