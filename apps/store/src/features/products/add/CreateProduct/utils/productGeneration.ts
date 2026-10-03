import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { PRODUCT_STATUS } from '@/lib/domain/products/constants';
import { PRODUCT_GENERATION_MODE } from '../constants';
import type {
  CreateProductVariantValues,
  ProductGenerationMode,
  ProductGenerationValues,
  ProductVariantsGeneratedArgs,
} from '../types';

export type GeneratedProductAttributeValue = {
  id: number;
  name: string;
};

type GetGeneratedProductVariantsArgs = {
  attributeValuesByAttributeId: Record<string, string[]>;
  attributes: AttributeDropdown[];
  description: string;
  productName: string;
};

type UpdateAttributeValueSelectionArgs = {
  attributeId: string;
  attributeValueId: string;
  attributeValuesByAttributeId: Record<string, string[]>;
  pressed: boolean;
};

export const getAttributeValueSelections = (
  currentValue: Record<string, string[]>,
  attributes: AttributeDropdown[]
) =>
  Object.fromEntries(
    attributes.map((attribute) => {
      const attributeId = String(attribute.id);
      const availableValueIds = new Set(
        attribute.attributeValues.map((attributeValue) =>
          String(attributeValue.id)
        )
      );

      return [
        attributeId,
        (currentValue[attributeId] ?? []).filter((attributeValueId) =>
          availableValueIds.has(attributeValueId)
        ),
      ];
    })
  );

export const updateAttributeValueSelection = ({
  attributeId,
  attributeValueId,
  attributeValuesByAttributeId,
  pressed,
}: UpdateAttributeValueSelectionArgs) => {
  const selectedAttributeValueIds =
    attributeValuesByAttributeId[attributeId] ?? [];

  return {
    ...attributeValuesByAttributeId,
    [attributeId]: pressed
      ? [...selectedAttributeValueIds, attributeValueId]
      : selectedAttributeValueIds.filter(
          (selectedAttributeValueId) =>
            selectedAttributeValueId !== attributeValueId
        ),
  };
};

export const getSelectedAttributeValueGroups = (
  attributes: AttributeDropdown[],
  attributeValuesByAttributeId: Record<string, string[]>
): GeneratedProductAttributeValue[][] =>
  attributes.map((attribute) => {
    const selectedValueIds = new Set(
      attributeValuesByAttributeId[String(attribute.id)] ?? []
    );

    return attribute.attributeValues
      .filter((attributeValue) =>
        selectedValueIds.has(String(attributeValue.id))
      )
      .map((attributeValue) => ({
        id: attributeValue.id,
        name: attributeValue.name,
      }));
  });

export const getSelectedAttributeValues = (
  attributes: AttributeDropdown[],
  attributeValuesByAttributeId: Record<string, string[]>
): GeneratedProductAttributeValue[] =>
  getSelectedAttributeValueGroups(
    attributes,
    attributeValuesByAttributeId
  ).flat();

export const getGeneratedProductsCount = (
  attributes: AttributeDropdown[],
  attributeValuesByAttributeId: Record<string, string[]>
) =>
  attributes.reduce((count, attribute) => {
    const selectedValueIds = new Set(
      attributeValuesByAttributeId[String(attribute.id)]
    );
    const selectedCount = attribute.attributeValues.filter((attributeValue) =>
      selectedValueIds.has(String(attributeValue.id))
    ).length;

    return selectedCount > 0 ? Math.max(count, 1) * selectedCount : count;
  }, 0);

export const getGeneratedProductName = (
  productName: string,
  attributeValues: GeneratedProductAttributeValue[]
) =>
  [
    productName.trim(),
    ...attributeValues.map((attributeValue) => attributeValue.name),
  ]
    .filter(Boolean)
    .join(' ');

export const getGeneratedSingleProductVariant = ({
  attributeValues,
  description,
  productName,
}: {
  attributeValues: GeneratedProductAttributeValue[];
  description: string;
  productName: string;
}): CreateProductVariantValues => ({
  attributeValueIds: attributeValues.map((attributeValue) => attributeValue.id),
  barcode: '',
  description,
  name: getGeneratedProductName(productName, attributeValues),
  sku: '',
  status: PRODUCT_STATUS.DRAFT,
});

export const getGeneratedProductVariants = ({
  attributeValuesByAttributeId,
  attributes,
  description,
  productName,
}: GetGeneratedProductVariantsArgs): CreateProductVariantValues[] => {
  const selectedAttributeValueGroups = getSelectedAttributeValueGroups(
    attributes,
    attributeValuesByAttributeId
  ).filter((group) => group.length > 0);

  if (selectedAttributeValueGroups.length === 0) {
    return [];
  }

  const attributeValueCombinations = selectedAttributeValueGroups.reduce<
    GeneratedProductAttributeValue[][]
  >(
    (combinations, attributeValueGroup) =>
      combinations.flatMap((combination) =>
        attributeValueGroup.map((attributeValue) => [
          ...combination,
          attributeValue,
        ])
      ),
    [[]]
  );

  return attributeValueCombinations.map((attributeValues) =>
    getGeneratedSingleProductVariant({
      attributeValues,
      description,
      productName,
    })
  );
};

export const getProductVariantsGeneratedArgs = ({
  generationMode,
  value,
}: {
  generationMode: ProductGenerationMode;
  value: ProductGenerationValues;
}): ProductVariantsGeneratedArgs => {
  const productVariants =
    generationMode === PRODUCT_GENERATION_MODE.many
      ? getGeneratedProductVariants({
          attributeValuesByAttributeId: value.attributeValues,
          attributes: value.attributes,
          description: value.description,
          productName: value.name,
        })
      : [
          getGeneratedSingleProductVariant({
            attributeValues: getSelectedAttributeValues(
              value.attributes,
              value.attributeValues
            ),
            description: value.description,
            productName: value.name,
          }),
        ];

  return {
    attributes: value.attributes,
    category: value.category,
    description: value.description,
    name: value.name,
    productVariants,
  };
};

type IndexedAttributeValue = GeneratedProductAttributeValue & {
  position: number;
};

const attributeValueIndexByAttributes = new WeakMap<
  AttributeDropdown[],
  Map<number, IndexedAttributeValue>
>();

const getAttributeValueIndex = (attributes: AttributeDropdown[]) => {
  const cachedIndex = attributeValueIndexByAttributes.get(attributes);

  if (cachedIndex) {
    return cachedIndex;
  }

  const index = new Map<number, IndexedAttributeValue>();

  for (const attribute of attributes) {
    for (const attributeValue of attribute.attributeValues) {
      index.set(attributeValue.id, {
        id: attributeValue.id,
        name: attributeValue.name,
        position: index.size,
      });
    }
  }

  attributeValueIndexByAttributes.set(attributes, index);

  return index;
};

export const getProductVariantAttributeValues = (
  attributes: AttributeDropdown[],
  attributeValueIds: number[]
): GeneratedProductAttributeValue[] => {
  const index = getAttributeValueIndex(attributes);
  const selectedAttributeValues = new Map<number, IndexedAttributeValue>();

  for (const attributeValueId of attributeValueIds) {
    const attributeValue = index.get(attributeValueId);

    if (attributeValue) {
      selectedAttributeValues.set(attributeValueId, attributeValue);
    }
  }

  return [...selectedAttributeValues.values()]
    .sort((first, second) => first.position - second.position)
    .map(({ id, name }) => ({ id, name }));
};
