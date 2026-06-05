'use client';

import type { Attribute } from '@/lib/api/types';
import { CLIENT_BACKEND_PATHS } from '@/lib/client/apiPaths';
import { apiFetch } from '@/lib/client/fetch';

type CreateAttributeInput = {
  name: string;
  sortOrder: number;
  attributeValues: string[];
};

export const createAttribute = (input: CreateAttributeInput) =>
  apiFetch<Attribute>(CLIENT_BACKEND_PATHS.attributes, {
    method: 'POST',
    body: input,
  });
