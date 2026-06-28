const getAttributeQueryId = (attributeId: string | number) =>
  String(attributeId);

export const attributesQueryKeys = {
  list: ['attributes', 'list'] as const,
  detail: (attributeId: string | number) =>
    ['attributes', 'detail', getAttributeQueryId(attributeId)] as const,
  values: (attributeId: string | number) =>
    [
      'attributes',
      'detail',
      getAttributeQueryId(attributeId),
      'values',
    ] as const,
};
