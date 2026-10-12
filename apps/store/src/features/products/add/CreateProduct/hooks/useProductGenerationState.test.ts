import { act, renderHook } from '@testing-library/react';
import { useProductGenerationState } from './useProductGenerationState';

describe('useProductGenerationState', () => {
  it('stores generated attributes and enters the configuration stage', () => {
    const { result } = renderHook(() => useProductGenerationState());
    const attributes = [
      {
        attributeValues: [],
        createdAt: '2026-09-04T00:00:00.000Z',
        id: 7,
        name: 'Color',
        sortOrder: 1,
        status: 'DRAFT' as const,
      },
    ];

    expect(result.current.generatedAttributes).toEqual([]);
    expect(result.current.isProductVariantGenerationStage).toBe(true);

    act(() => {
      result.current.onProductVariantsGenerated({
        attributes,
        category: '2',
        description: '',
        name: 'Running Shoes',
        productVariants: [],
      });
    });

    expect(result.current.generatedAttributes).toEqual(attributes);
    expect(result.current.isProductVariantGenerationStage).toBe(false);
  });
});
