import type { CreateProductValues } from '../types';
import {
  validateProductCategory,
  validateProductName,
  validateProductVariants,
} from './validations';

const getProductValues = (
  productVariants: CreateProductValues['productVariants']
): CreateProductValues => ({
  attributes: [],
  attributeValues: {},
  category: '2',
  description: '',
  productName: 'Running Shoes',
  productVariants,
});

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

describe('validateProductVariants', () => {
  it('requires a name, barcode, and SKU for each variant', () => {
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
        'productVariants[0].barcode': 'Barcode is required',
        'productVariants[0].name': 'Product variant name is required',
        'productVariants[0].sku': 'SKU is required',
      },
    });
  });

  it('requires unique barcodes and SKUs across variants', () => {
    expect(
      validateProductVariants({
        value: getProductValues([
          {
            attributeValueIds: [],
            barcode: 'barcode-1',
            description: '',
            name: 'Running Shoes Blue',
            sku: 'SHOE-BLUE',
          },
          {
            attributeValueIds: [],
            barcode: ' barcode-1 ',
            description: '',
            name: 'Running Shoes Red',
            sku: 'SHOE-BLUE',
          },
        ]),
      })
    ).toEqual({
      fields: {
        'productVariants[0].barcode':
          'Barcode must be unique across variants',
        'productVariants[0].sku': 'SKU must be unique across variants',
        'productVariants[1].barcode':
          'Barcode must be unique across variants',
        'productVariants[1].sku': 'SKU must be unique across variants',
      },
    });
  });

  it('accepts variants with unique barcodes and SKUs', () => {
    expect(
      validateProductVariants({
        value: getProductValues([
          {
            attributeValueIds: [],
            barcode: 'barcode-1',
            description: '',
            name: 'Running Shoes Blue',
            sku: 'SHOE-BLUE',
          },
          {
            attributeValueIds: [],
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
