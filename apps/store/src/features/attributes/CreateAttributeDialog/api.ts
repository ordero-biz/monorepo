'use client';

import { BACKEND_ATTRIBUTE_PATHS } from '@/lib/api/constants';
import type { Attribute } from '@/lib/api/types';
import { apiFetch } from '@/lib/client/fetch';

type CreateAttributeInput = {
  name: string;
  sortOrder: number;
};

export const createAttribute = (input: CreateAttributeInput) =>
  apiFetch<Attribute>(BACKEND_ATTRIBUTE_PATHS.postAttribute, {
    method: 'POST',
    body: input,
  });
