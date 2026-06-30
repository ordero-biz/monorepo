'use client';

import { useQuery } from '@tanstack/react-query';
import { getAttributeValues } from '@/lib/client/api/attributes';
import { attributeValuesQueryOptions } from '../../query/attributes/attributesQueryOptions';

export const useAttributeValuesQuery = (attributeId: string | number) =>
  useQuery(attributeValuesQueryOptions(attributeId, getAttributeValues));
