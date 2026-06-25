'use client';

import { apiFetch } from '@ordero/api-client';
import type { PaginatedResponse } from '@/lib/api/types';
import type { Attribute } from '@/lib/domain/attributes';
import { CLIENT_BACKEND_PATHS } from '../../apiPaths';

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
