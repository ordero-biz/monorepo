import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { PRODUCT_GENERATION_MODE } from '../constants';
import type { CreateProductValues } from '../types';
import {
  validateCreateProduct,
  validateProductCategory,
  validateProductName,
  validateProductTemplate,
  validateProductVariants,
} from './validations';

const getProductValues = (
  productVariants: CreateProductValues['productVariants'],
  productVariantsGenerationMode: CreateProductValues['productVariantsGenerationMode'] = PRODUCT_GENERATION_MODE.many
): CreateProductValues => ({
  attributes: [],
  attributeValues: {},
  category: '2',
  description: '',
  productName: 'Running Shoes',
  productVariants,
  productVariantsGenerationMode,
});

const colorAttribute = {
  id: 7,
  name: 'Color',
  sortOrder: 1,
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

describe('validateProductTemplate', () => {
  it('requires a name and category before a product preview can be generated', () => {
    expect(
      validateProductTemplate({
        value: {
          ...getProductValues([], PRODUCT_GENERATION_MODE.one),
          category: null,
          productName: '   ',
        },
      })
    ).toEqual({
      fields: {
        category: 'Category is required',
        productName: 'Product name is required',
      },
    });
  });

  it('requires attributes in multiple-products mode', () => {
    expect(
      validateProductTemplate({
        value: {
          ...getProductValues([]),
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
        value: {
          ...getProductValues([]),
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
        value: getProductValues([
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
        value: getProductValues(
          [
            {
              attributeValueIds: [],
              barcode: 'barcode-1',
              description: '',
              name: 'Running Shoes',
              sku: 'SHOE',
            },
          ],
          PRODUCT_GENERATION_MODE.one
        ),
      })
    ).toBeUndefined();
  });

  it('requires unique barcodes and SKUs across variants', () => {
    expect(
      validateProductVariants({
        value: getProductValues([
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
        value: getProductValues([
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
        value: getProductValues([
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
        value: getProductValues([
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

describe('validateCreateProduct', () => {
  it('returns template and variant errors together on submit', () => {
    expect(
      validateCreateProduct({
        value: {
          ...getProductValues(
            [
              {
                attributeValueIds: [],
                barcode: '',
                description: '',
                name: '',
                sku: '',
              },
            ],
            PRODUCT_GENERATION_MODE.one
          ),
          category: null,
          productName: '',
        },
      })
    ).toEqual({
      fields: {
        'productVariants[0].barcode': 'Barcode is required',
        'productVariants[0].name': 'Product variant name is required',
        'productVariants[0].sku': 'SKU is required',
        category: 'Category is required',
        productName: 'Product name is required',
      },
    });
  });
});
