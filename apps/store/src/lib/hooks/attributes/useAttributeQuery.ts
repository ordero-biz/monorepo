'use client';

import { useQuery } from '@tanstack/react-query';
import { getAttribute } from '@/lib/client/api/attributes';
import { attributeQueryOptions } from '../../query/attributes/attributesQueryOptions';

export const useAttributeQuery = (attributeId: string | number) =>
  useQuery(attributeQueryOptions(attributeId, getAttribute));
