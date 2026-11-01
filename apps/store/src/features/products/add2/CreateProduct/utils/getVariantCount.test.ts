import { PRODUCT_GENERATION_MODE } from '../../../add/CreateProduct';
import { getVariantCount } from './getVariantCount';

describe('Variant count', () => {
  it('counts one variant in single mode regardless of selected values', () => {
    expect(
      getVariantCount({
        attributes: [{ id: 1 }],
        attributeValues: { '1': ['11', '12'] },
        generationMode: PRODUCT_GENERATION_MODE.one,
      })
    ).toBe(1);
  });

  it('has no combination total before values are selected', () => {
    expect(
      getVariantCount({
        attributes: [{ id: 1 }],
        attributeValues: {},
        generationMode: PRODUCT_GENERATION_MODE.many,
      })
    ).toBe(0);
  });

  it('counts combinations from selected values while ignoring unselected and removed attributes', () => {
    expect(
      getVariantCount({
        attributes: [{ id: 1 }, { id: 2 }, { id: 3 }],
        attributeValues: {
          '1': ['11', '12'],
          '2': ['21', '22', '23'],
          '3': [],
          '4': ['41', '42'],
        },
        generationMode: PRODUCT_GENERATION_MODE.many,
      })
    ).toBe(6);
  });

  it('reports an exceeded limit for large selections', () => {
    const values = Array.from({ length: 25 }, (_, index) => String(index));
    expect(
      getVariantCount({
        attributes: [{ id: 1 }, { id: 2 }],
        attributeValues: { '1': values, '2': values },
        generationMode: PRODUCT_GENERATION_MODE.many,
      })
    ).toBeGreaterThan(500);
  });

  it('accepts exactly the supported maximum number of variants', () => {
    expect(
      getVariantCount({
        attributes: [{ id: 1 }, { id: 2 }],
        attributeValues: {
          '1': Array.from({ length: 20 }, (_, index) => String(index)),
          '2': Array.from({ length: 25 }, (_, index) => String(index)),
        },
        generationMode: PRODUCT_GENERATION_MODE.many,
      })
    ).toBe(500);
  });
});
