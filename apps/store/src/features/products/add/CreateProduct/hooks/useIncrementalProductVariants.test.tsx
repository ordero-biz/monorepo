import { act, render, screen, waitFor } from '@testing-library/react';
import { useIncrementalProductVariants } from './useIncrementalProductVariants';

const intersectionObserverCallbacks: IntersectionObserverCallback[] = [];

class IntersectionObserverMock {
  constructor(callback: IntersectionObserverCallback) {
    intersectionObserverCallbacks.push(callback);
  }

  disconnect = vi.fn();
  observe = vi.fn();
}

const IncrementalProductVariantList = ({
  productVariantCount,
}: {
  productVariantCount: number;
}) => {
  const { hasMoreVariants, loadMoreRef, visibleVariantIndexes } =
    useIncrementalProductVariants({
      productVariantCount,
    });

  return (
    <>
      <ul>
        {visibleVariantIndexes.map((variantIndex) => (
          <li key={variantIndex}>Product variant {variantIndex + 1}</li>
        ))}
      </ul>
      {hasMoreVariants ? <div ref={loadMoreRef} /> : null}
    </>
  );
};

describe('useIncrementalProductVariants', () => {
  beforeEach(() => {
    intersectionObserverCallbacks.length = 0;
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps loaded variants visible until a new generation begins', () => {
    const { rerender } = render(
      <IncrementalProductVariantList key={1} productVariantCount={40} />
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(20);

    act(() => {
      intersectionObserverCallbacks[0]?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(screen.getAllByRole('listitem')).toHaveLength(40);

    rerender(
      <IncrementalProductVariantList key={1} productVariantCount={40} />
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(40);

    rerender(
      <IncrementalProductVariantList key={2} productVariantCount={40} />
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(20);
  });

  it('shows all variants when IntersectionObserver is unavailable', async () => {
    vi.stubGlobal('IntersectionObserver', undefined);

    render(<IncrementalProductVariantList productVariantCount={40} />);

    await waitFor(() =>
      expect(screen.getAllByRole('listitem')).toHaveLength(40)
    );
  });
});
