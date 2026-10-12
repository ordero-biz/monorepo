import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { PRODUCT_STATUS } from '@/lib/domain/products/constants';
import {
  DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS,
  PRODUCT_GENERATION_MODE,
} from '../constants';
import type {
  ProductGenerationValues,
  ProductVariantsCreationValues,
} from '../types';
import {
  validateProductAttributes,
  validateProductCategory,
  validateProductConfiguration,
  validateProductName,
  validateProductStatus,
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
  status: PRODUCT_STATUS.DRAFT,
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

describe('validateProductStatus', () => {
  it('accepts the supported product statuses', () => {
    expect(
      validateProductStatus({ value: PRODUCT_STATUS.DRAFT })
    ).toBeUndefined();
    expect(
      validateProductStatus({ value: PRODUCT_STATUS.ACTIVE })
    ).toBeUndefined();
  });

  it('rejects an unsupported product status', () => {
    expect(validateProductStatus({ value: 'ARCHIVED' as never })).toBe(
      'Product status must be Draft or Active'
    );
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
  it('leaves single-field rules to the field validators', () => {
    expect(
      validateProductTemplate({
        generationMode: PRODUCT_GENERATION_MODE.many,
        maxGeneratedProductVariants: DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS,
        value: {
          ...getProductGenerationValues(),
          attributes: [],
          category: null,
          name: '   ',
        },
      })
    ).toBeUndefined();
  });

  it('requires an attribute value in multiple-products mode', () => {
    expect(
      validateProductTemplate({
        generationMode: PRODUCT_GENERATION_MODE.many,
        maxGeneratedProductVariants: DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS,
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

describe('validateProductTemplate generation limit', () => {
  const createAttribute = (id: number, valueCount: number) => ({
    ...colorAttribute,
    attributeValues: Array.from({ length: valueCount }, (_, index) => ({
      createdAt: colorAttribute.createdAt,
      id: id * 1000 + index,
      name: `Value ${index}`,
      sortOrder: index,
      status: 'DRAFT' as const,
    })),
    id,
  });

  it('rejects selections that generate too many products', () => {
    const attributes = [createAttribute(1, 23), createAttribute(2, 23)];

    expect(
      validateProductTemplate({
        generationMode: PRODUCT_GENERATION_MODE.many,
        maxGeneratedProductVariants: DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS,
        value: {
          ...getProductGenerationValues(),
          attributes,
          attributeValues: {
            '1': attributes[0].attributeValues.map(({ id }) => String(id)),
            '2': attributes[1].attributeValues.map(({ id }) => String(id)),
          },
        },
      })
    ).toEqual({
      fields: {
        attributeValues: `Selected values generate 529 products. Select fewer values to generate at most ${DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS}.`,
      },
    });
  });

  it('uses the provided limit instead of the default', () => {
    const attributes = [createAttribute(1, 4), createAttribute(2, 3)];
    const value = {
      ...getProductGenerationValues(),
      attributes,
      attributeValues: {
        '1': attributes[0].attributeValues.map(({ id }) => String(id)),
        '2': attributes[1].attributeValues.map(({ id }) => String(id)),
      },
    };

    expect(
      validateProductTemplate({
        generationMode: PRODUCT_GENERATION_MODE.many,
        maxGeneratedProductVariants: 10,
        value,
      })
    ).toEqual({
      fields: {
        attributeValues:
          'Selected values generate 12 products. Select fewer values to generate at most 10.',
      },
    });
    expect(
      validateProductTemplate({
        generationMode: PRODUCT_GENERATION_MODE.many,
        maxGeneratedProductVariants: 12,
        value,
      })
    ).toBeUndefined();
  });

  it('allows selections up to the limit', () => {
    const attributes = [createAttribute(1, 22), createAttribute(2, 22)];

    expect(
      validateProductTemplate({
        generationMode: PRODUCT_GENERATION_MODE.many,
        maxGeneratedProductVariants: DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS,
        value: {
          ...getProductGenerationValues(),
          attributes,
          attributeValues: {
            '1': attributes[0].attributeValues.map(({ id }) => String(id)),
            '2': attributes[1].attributeValues.map(({ id }) => String(id)),
          },
        },
      })
    ).toBeUndefined();
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
            status: PRODUCT_STATUS.DRAFT,
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
            status: PRODUCT_STATUS.DRAFT,
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
            status: PRODUCT_STATUS.DRAFT,
          },
          {
            attributeValueIds: [71],
            barcode: ' barcode-1 ',
            description: '',
            name: 'Running Shoes Red',
            sku: 'SHOE-BLUE',
            status: PRODUCT_STATUS.DRAFT,
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
            status: PRODUCT_STATUS.DRAFT,
          },
          {
            attributeValueIds: [71],
            barcode: 'barcode-1',
            description: '',
            name: 'Running Shoes Green',
            sku: 'SHOE',
            status: PRODUCT_STATUS.DRAFT,
          },
          {
            attributeValueIds: [72],
            barcode: 'barcode-1',
            description: '',
            name: 'Running Shoes Blue',
            sku: 'SHOE',
            status: PRODUCT_STATUS.DRAFT,
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
            status: PRODUCT_STATUS.DRAFT,
          },
          {
            attributeValueIds: [80, 72],
            barcode: 'barcode-2',
            description: '',
            name: 'Running Shoes China Blue',
            sku: 'SHOE-CHINA-BLUE',
            status: PRODUCT_STATUS.DRAFT,
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
            status: PRODUCT_STATUS.DRAFT,
          },
          {
            attributeValueIds: [71],
            barcode: 'barcode-2',
            description: '',
            name: 'Running Shoes Red',
            sku: 'SHOE-RED',
            status: PRODUCT_STATUS.DRAFT,
          },
        ]),
      })
    ).toBeUndefined();
  });
});

describe('validateProductConfiguration', () => {
  it('leaves single-field rules to the field validators', () => {
    expect(
      validateProductConfiguration({
        generationMode: PRODUCT_GENERATION_MODE.one,
        value: {
          ...getProductVariantsCreationValues([
            {
              attributeValueIds: [],
              barcode: 'barcode-1',
              description: '',
              name: 'Running Shoes',
              sku: 'SHOE',
              status: 'ARCHIVED' as never,
            },
          ]),
          category: null,
          name: '   ',
          status: 'ARCHIVED' as never,
        },
      })
    ).toBeUndefined();
  });

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
            status: PRODUCT_STATUS.DRAFT,
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
