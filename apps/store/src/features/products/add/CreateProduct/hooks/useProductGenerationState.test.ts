import { act, renderHook } from '@testing-library/react';
import { useProductGenerationState } from './useProductGenerationState';

describe('useProductGenerationState', () => {
  it('stores generated attributes and advances the generation version', () => {
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
    expect(result.current.generatedTemplateSignature).toBeUndefined();
    expect(result.current.generationVersion).toBe(0);

    act(() => {
      result.current.onProductVariantsGenerated({
        attributes,
        generationSignature: 'running-shoes-color',
      });
    });

    expect(result.current.generatedAttributes).toEqual(attributes);
    expect(result.current.generatedTemplateSignature).toBe(
      'running-shoes-color'
    );
    expect(result.current.generationVersion).toBe(1);
  });
});
