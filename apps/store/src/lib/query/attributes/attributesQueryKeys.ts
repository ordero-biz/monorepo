export const attributesQueryKeys = {
  list: ['attributes', 'list'] as const,
  detail: (attributeId: string | number) =>
    ['attributes', 'detail', String(attributeId)] as const,
  values: (attributeId: string | number) =>
    ['attributes', 'detail', String(attributeId), 'values'] as const,
};
