'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getAttribute,
  getAttributes,
  getAttributeValues,
} from '@/lib/client/api/attributes';

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

export const useAttributesQuery = () =>
  useQuery({
    queryKey: attributesQueryKeys.list,
    queryFn: async () => {
      const result = await getAttributes();

      if (!result.ok) {
        throw result.error;
      }

      return result.data;
    },
    retry: false,
  });

export const useAttributeQuery = (attributeId: string | number) =>
  useQuery({
    queryKey: attributesQueryKeys.detail(attributeId),
    queryFn: async () => {
      const result = await getAttribute(attributeId);

      if (!result.ok) {
        throw result.error;
      }

      return result.data;
    },
    retry: false,
  });

export const useAttributeValuesQuery = (attributeId: string | number) =>
  useQuery({
    queryKey: attributesQueryKeys.values(attributeId),
    queryFn: async () => {
      const result = await getAttributeValues(attributeId);

      if (!result.ok) {
        throw result.error;
      }

      return result.data;
    },
    retry: false,
  });
