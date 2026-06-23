export const getAttributeValueFieldId = (index: number) =>
  `attribute-value-${index}`;

export const getEmptyAttributeValueField = (index: number) => {
  const fieldId = getAttributeValueFieldId(index);

  return {
    id: fieldId,
    value: '',
  };
};
