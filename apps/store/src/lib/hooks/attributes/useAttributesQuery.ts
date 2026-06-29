'use client';

import { useQuery } from '@tanstack/react-query';
import { getAttributes } from '@/lib/client/api/attributes';
import { attributesListQueryOptions } from '../../query/attributes/attributesQueryOptions';

export const useAttributesQuery = () =>
  useQuery(attributesListQueryOptions(getAttributes));
