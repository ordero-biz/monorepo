import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import type { CreateProductVariantValues } from '../types';

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

export const getSelectedAttributeValues = (
  attributes: AttributeDropdown[],
  attributeValuesByAttributeId: Record<string, string[]>
): GeneratedProductAttributeValue[] =>
  attributes.flatMap((attribute) => {
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

export const getProductVariantAttributeValues = (
  attributes: AttributeDropdown[],
  attributeValueIds: number[]
): GeneratedProductAttributeValue[] => {
  const selectedAttributeValueIds = new Set(attributeValueIds);

  return attributes.flatMap((attribute) =>
    attribute.attributeValues
      .filter((attributeValue) =>
        selectedAttributeValueIds.has(attributeValue.id)
      )
      .map((attributeValue) => ({
        id: attributeValue.id,
        name: attributeValue.name,
      }))
  );
};
