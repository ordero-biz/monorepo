'use client';

import type { Attribute } from '@/features/attributes/types';
import type { PaginatedResponse } from '@/lib/api/types';
import { CLIENT_BACKEND_PATHS } from '../../apiPaths';
import { apiFetch } from '../../fetch';

type AttributesListResponse = PaginatedResponse<Attribute>;

export const getAttributes = () =>
  apiFetch<AttributesListResponse>(CLIENT_BACKEND_PATHS.attributes, {
    method: 'GET',
  });

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
