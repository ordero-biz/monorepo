import { getInvalidProductVariantIndexes } from './productVariantErrors';

describe('getInvalidProductVariantIndexes', () => {
  it('returns variants with field errors and ignores other field metadata', () => {
    expect(
      getInvalidProductVariantIndexes({
        'category.name': { errors: ['Select a category.'] },
        'productVariants[0].sku': { errors: ['SKU is required.'] },
        'productVariants[1].name': { errors: [] },
        'productVariants[2].status': { errors: ['Select a status.'] },
        'productVariants[2].barcode': { errors: ['Barcode is required.'] },
        'productVariants[3].name': null,
      })
    ).toEqual([0, 2]);
  });

  it('can limit invalid variants to the requested fields', () => {
    expect(
      getInvalidProductVariantIndexes(
        {
          'productVariants[0].sku': { errors: ['SKU is required.'] },
          'productVariants[1].barcode': { errors: ['Barcode is required.'] },
          'productVariants[2].status': { errors: ['Select a status.'] },
          'productVariants[3].name': { errors: ['Name is required.'] },
          'productVariants[3].description': {
            errors: ['Description is too long.'],
          },
          'productVariants[4].attributeValueIds': {
            errors: ['Select a value.'],
          },
          'productVariants[5].description': {
            errors: ['Description is too long.'],
          },
        },
        ['name', 'description', 'attributeValueIds']
      )
    ).toEqual([3, 4, 5]);
  });
});
