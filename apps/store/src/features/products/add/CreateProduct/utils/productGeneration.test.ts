import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { PRODUCT_GENERATION_MODE } from '../constants';
import {
  getAttributeValueSelections,
  getGeneratedProductName,
  getGeneratedProductVariants,
  getGeneratedSingleProductVariant,
  getProductVariantAttributeValues,
  getProductVariantGenerationSignature,
  getSelectedAttributeValueGroups,
  getSelectedAttributeValues,
} from './productGeneration';

const attributes: AttributeDropdown[] = [
  {
    id: 2,
    name: 'Material',
    sortOrder: 1,
    status: 'DRAFT',
    createdAt: '2026-09-04T12:00:00.000Z',
    attributeValues: [
      {
        id: 21,
        name: 'Cotton',
        sortOrder: 0,
        status: 'DRAFT',
        createdAt: '2026-09-04T12:00:00.000Z',
      },
    ],
  },
  {
    id: 1,
    name: 'Color',
    sortOrder: 0,
    status: 'DRAFT',
    createdAt: '2026-09-04T12:00:00.000Z',
    attributeValues: [
      {
        id: 11,
        name: 'Blue',
        sortOrder: 0,
        status: 'DRAFT',
        createdAt: '2026-09-04T12:00:00.000Z',
      },
      {
        id: 12,
        name: 'Red',
        sortOrder: 1,
        status: 'DRAFT',
        createdAt: '2026-09-04T12:00:00.000Z',
      },
    ],
  },
];

describe('product generation', () => {
  it('uses the same signature for equivalent template selections', () => {
    const firstSignature = getProductVariantGenerationSignature({
      attributeValuesByAttributeId: { '1': ['12', '11', '11'], '2': ['21'] },
      attributes,
      description: 'Lightweight',
      generationMode: PRODUCT_GENERATION_MODE.many,
      productName: ' Running Shoes ',
    });
    const secondSignature = getProductVariantGenerationSignature({
      attributeValuesByAttributeId: { '1': ['11', '12'], '2': ['21'] },
      attributes: [...attributes].reverse(),
      description: 'Lightweight',
      generationMode: PRODUCT_GENERATION_MODE.many,
      productName: 'Running Shoes',
    });

    expect(firstSignature).toBe(secondSignature);
  });

  it('keeps only selections that belong to the current attributes', () => {
    expect(
      getAttributeValueSelections(
        { '1': ['11', '99'], '2': ['21'], '3': ['31'] },
        [attributes[1]]
      )
    ).toEqual({ '1': ['11'] });
  });

  it('maps selected values to their display values and variant payload', () => {
    const selectedAttributeValues = getSelectedAttributeValues(attributes, {
      '1': ['11'],
      '2': ['21'],
    });

    expect(selectedAttributeValues).toEqual([
      { id: 21, name: 'Cotton' },
      { id: 11, name: 'Blue' },
    ]);
    expect(
      getSelectedAttributeValueGroups(attributes, { '1': ['11'], '2': ['21'] })
    ).toEqual([[{ id: 21, name: 'Cotton' }], [{ id: 11, name: 'Blue' }]]);
    expect(
      getGeneratedProductName(' Running Shoes ', selectedAttributeValues)
    ).toBe('Running Shoes Cotton Blue');
    expect(
      getGeneratedSingleProductVariant({
        attributeValues: selectedAttributeValues,
        description: 'Lightweight',
        productName: ' Running Shoes ',
      })
    ).toEqual({
      attributeValueIds: [21, 11],
      barcode: '',
      description: 'Lightweight',
      name: 'Running Shoes Cotton Blue',
      sku: '',
    });
    expect(getProductVariantAttributeValues(attributes, [11, 99])).toEqual([
      { id: 11, name: 'Blue' },
    ]);
  });

  it('creates the cartesian product of selected attribute values', () => {
    expect(
      getGeneratedProductVariants({
        attributeValuesByAttributeId: { '1': ['11', '12'], '2': ['21'] },
        attributes,
        description: '',
        productName: 'Running Shoes',
      })
    ).toEqual([
      {
        attributeValueIds: [21, 11],
        barcode: '',
        description: '',
        name: 'Running Shoes Cotton Blue',
        sku: '',
      },
      {
        attributeValueIds: [21, 12],
        barcode: '',
        description: '',
        name: 'Running Shoes Cotton Red',
        sku: '',
      },
    ]);
  });

  it('does not create multiple products when no values are selected', () => {
    expect(
      getGeneratedProductVariants({
        attributeValuesByAttributeId: {},
        attributes,
        description: '',
        productName: 'Running Shoes',
      })
    ).toEqual([]);
  });
});
