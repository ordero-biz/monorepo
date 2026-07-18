export const getAttributeValueFieldId = (index: number) =>
  `attribute-value-${index}`;

export const getEmptyAttributeValueField = (index: number) => ({
  id: getAttributeValueFieldId(index),
  value: '',
});
