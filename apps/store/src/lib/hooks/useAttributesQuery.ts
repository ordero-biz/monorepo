'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getAttribute,
  getAttributes,
  getAttributeValues,
} from '@/lib/client/api/attributes';
import {
  attributeQueryOptions,
  attributesListQueryOptions,
  attributeValuesQueryOptions,
} from './attributesQueryOptions';

export { attributesQueryKeys } from './attributesQueryKeys';

export const useAttributesQuery = () =>
  useQuery(attributesListQueryOptions(getAttributes));

export const useAttributeQuery = (attributeId: string | number) =>
  useQuery(attributeQueryOptions(attributeId, getAttribute));

export const useAttributeValuesQuery = (attributeId: string | number) =>
  useQuery(attributeValuesQueryOptions(attributeId, getAttributeValues));
