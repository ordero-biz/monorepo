import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { PRODUCT_GENERATION_MODE } from '../constants';
import type {
  ProductGenerationValues,
  ProductVariantsCreationValues,
} from '../types';
import {
  validateProductAttributes,
  validateProductCategory,
  validateProductConfiguration,
  validateProductName,
  validateProductTemplate,
  validateProductVariants,
} from './validations';

const getProductGenerationValues = (): ProductGenerationValues => ({
  attributes: [],
  attributeValues: {},
  category: '2',
  description: '',
  name: 'Running Shoes',
});

const getProductVariantsCreationValues = (
  productVariants: ProductVariantsCreationValues['productVariants']
): ProductVariantsCreationValues => ({
  category: '2',
  description: '',
  name: 'Running Shoes',
  productVariants,
});

const colorAttribute = {
  id: 7,
  name: 'Color',
  sortOrder: 1,
  status: 'DRAFT',
  createdAt: '2026-07-14T17:54:42.035Z',
  attributeValues: [],
} satisfies AttributeDropdown;

describe('validateProductName', () => {
  it('rejects a whitespace-only product name', () => {
    expect(validateProductName({ value: '   ' })).toBe(
      'Product name is required'
    );
  });

  it('accepts a non-empty product name', () => {
    expect(validateProductName({ value: 'Running Shoes' })).toBeUndefined();
  });
});

describe('validateProductCategory', () => {
  it('requires a category', () => {
    expect(validateProductCategory({ value: null })).toBe(
      'Category is required'
    );
  });

  it('accepts a selected category', () => {
    expect(validateProductCategory({ value: '2' })).toBeUndefined();
  });
});

describe('validateProductAttributes', () => {
  it('requires at least one attribute', () => {
    expect(validateProductAttributes({ value: [] })).toBe(
      'Select at least one attribute.'
    );
  });

  it('accepts selected attributes', () => {
    expect(
      validateProductAttributes({ value: [colorAttribute] })
    ).toBeUndefined();
  });
});

describe('validateProductTemplate', () => {
  it('requires a name and category before a product preview can be generated', () => {
    expect(
      validateProductTemplate({
        generationMode: PRODUCT_GENERATION_MODE.one,
        value: {
          ...getProductGenerationValues(),
          category: null,
          name: '   ',
        },
      })
    ).toEqual({
      fields: {
        category: 'Category is required',
        name: 'Product name is required',
      },
    });
  });

  it('requires attributes in multiple-products mode', () => {
    expect(
      validateProductTemplate({
        generationMode: PRODUCT_GENERATION_MODE.many,
        value: {
          ...getProductGenerationValues(),
          attributes: [],
        },
      })
    ).toEqual({
      fields: {
        attributes: 'Select at least one attribute.',
      },
    });
  });

  it('requires an attribute value in multiple-products mode', () => {
    expect(
      validateProductTemplate({
        generationMode: PRODUCT_GENERATION_MODE.many,
        value: {
          ...getProductGenerationValues(),
          attributes: [colorAttribute],
        },
      })
    ).toEqual({
      fields: {
        attributeValues: 'Select at least one attribute value.',
      },
    });
  });
});

describe('validateProductVariants', () => {
  it('requires attribute values, a name, barcode, and SKU for each variant', () => {
    expect(
      validateProductVariants({
        requireAttributeValueIds: true,
        value: getProductVariantsCreationValues([
          {
            attributeValueIds: [],
            barcode: '   ',
            description: '',
            name: '',
            sku: '',
          },
        ]),
      })
    ).toEqual({
      fields: {
        'productVariants[0].attributeValueIds':
          'Select at least one attribute value',
        'productVariants[0].barcode': 'Barcode is required',
        'productVariants[0].name': 'Product variant name is required',
        'productVariants[0].sku': 'SKU is required',
      },
    });
  });

  it('allows a single generated product variant without attribute values', () => {
    expect(
      validateProductVariants({
        requireAttributeValueIds: false,
        value: getProductVariantsCreationValues([
          {
            attributeValueIds: [],
            barcode: 'barcode-1',
            description: '',
            name: 'Running Shoes',
            sku: 'SHOE',
          },
        ]),
      })
    ).toBeUndefined();
  });

  it('requires unique barcodes and SKUs across variants', () => {
    expect(
      validateProductVariants({
        requireAttributeValueIds: true,
        value: getProductVariantsCreationValues([
          {
            attributeValueIds: [72],
            barcode: 'barcode-1',
            description: '',
            name: 'Running Shoes Blue',
            sku: 'SHOE-BLUE',
          },
          {
            attributeValueIds: [71],
            barcode: ' barcode-1 ',
            description: '',
            name: 'Running Shoes Red',
            sku: 'SHOE-BLUE',
          },
        ]),
      })
    ).toEqual({
      fields: {
        'productVariants[0].barcode': 'Barcode must be unique across variants',
        'productVariants[0].sku': 'SKU must be unique across variants',
        'productVariants[1].barcode': 'Barcode must be unique across variants',
        'productVariants[1].sku': 'SKU must be unique across variants',
      },
    });
  });

  it('marks every variant that shares a barcode or SKU', () => {
    expect(
      validateProductVariants({
        requireAttributeValueIds: true,
        value: getProductVariantsCreationValues([
          {
            attributeValueIds: [70],
            barcode: 'barcode-1',
            description: '',
            name: 'Running Shoes Red',
            sku: 'SHOE',
          },
          {
            attributeValueIds: [71],
            barcode: 'barcode-1',
            description: '',
            name: 'Running Shoes Green',
            sku: 'SHOE',
          },
          {
            attributeValueIds: [72],
            barcode: 'barcode-1',
            description: '',
            name: 'Running Shoes Blue',
            sku: 'SHOE',
          },
        ]),
      })
    ).toEqual({
      fields: {
        'productVariants[0].barcode': 'Barcode must be unique across variants',
        'productVariants[0].sku': 'SKU must be unique across variants',
        'productVariants[1].barcode': 'Barcode must be unique across variants',
        'productVariants[1].sku': 'SKU must be unique across variants',
        'productVariants[2].barcode': 'Barcode must be unique across variants',
        'productVariants[2].sku': 'SKU must be unique across variants',
      },
    });
  });

  it('requires unique attribute value sets across variants', () => {
    expect(
      validateProductVariants({
        requireAttributeValueIds: true,
        value: getProductVariantsCreationValues([
          {
            attributeValueIds: [72, 80],
            barcode: 'barcode-1',
            description: '',
            name: 'Running Shoes Blue China',
            sku: 'SHOE-BLUE-CHINA',
          },
          {
            attributeValueIds: [80, 72],
            barcode: 'barcode-2',
            description: '',
            name: 'Running Shoes China Blue',
            sku: 'SHOE-CHINA-BLUE',
          },
        ]),
      })
    ).toEqual({
      fields: {
        'productVariants[0].attributeValueIds':
          'Attribute values must be unique across variants',
        'productVariants[1].attributeValueIds':
          'Attribute values must be unique across variants',
      },
    });
  });

  it('accepts variants with unique attribute values, barcodes, and SKUs', () => {
    expect(
      validateProductVariants({
        requireAttributeValueIds: true,
        value: getProductVariantsCreationValues([
          {
            attributeValueIds: [72],
            barcode: 'barcode-1',
            description: '',
            name: 'Running Shoes Blue',
            sku: 'SHOE-BLUE',
          },
          {
            attributeValueIds: [71],
            barcode: 'barcode-2',
            description: '',
            name: 'Running Shoes Red',
            sku: 'SHOE-RED',
          },
        ]),
      })
    ).toBeUndefined();
  });
});

describe('validateProductConfiguration', () => {
  it('applies multiple-product variant requirements without generation fields', () => {
    expect(
      validateProductConfiguration({
        generationMode: PRODUCT_GENERATION_MODE.many,
        value: getProductVariantsCreationValues([
          {
            attributeValueIds: [],
            barcode: 'barcode-1',
            description: '',
            name: 'Running Shoes',
            sku: 'SHOE',
          },
        ]),
      })
    ).toEqual({
      fields: {
        'productVariants[0].attributeValueIds':
          'Select at least one attribute value',
      },
    });
  });
});
