'use client';

import { apiFetch } from '@ordero/api-client';
import type { Attribute, AttributeValue } from '@/lib/domain/attributes';
import type { PaginatedResponse } from '@/lib/server/types';
import { tokenizePath } from '@/lib/utils/tokenizePath';
import {
  getPaginationSearch,
  type PaginationSearchInput,
} from '@/lib/utils/url';
import { CLIENT_BACKEND_PATHS } from '../path';

type AttributesListResponse = PaginatedResponse<Attribute>;

export const getAttributesPath = (input?: PaginationSearchInput) =>
  `${CLIENT_BACKEND_PATHS.attributes}?${getPaginationSearch(input)}`;

export const getAttributes = (input?: PaginationSearchInput) =>
  apiFetch<AttributesListResponse>(getAttributesPath(input), {
    method: 'GET',
  });

export const getAttribute = (attributeId: string | number) =>
  apiFetch<Attribute>(
    tokenizePath(CLIENT_BACKEND_PATHS.attribute, { id: attributeId }),
    {
      method: 'GET',
    }
  );

export const getAttributeValues = (attributeId: string | number) =>
  apiFetch<AttributeValue[]>(
    tokenizePath(CLIENT_BACKEND_PATHS.attributeValues, { id: attributeId }),
    {
      method: 'GET',
    }
  );

type CreateAttributeInput = {
  name: string;
  sortOrder: number;
  attributeValues: {
    name: string;
    sortOrder: number;
  }[];
};

export const createAttribute = (input: CreateAttributeInput) =>
  apiFetch<Attribute>(CLIENT_BACKEND_PATHS.attributes, {
    method: 'POST',
    body: input,
  });

type UpdateAttributeInput = {
  attributeId: string | number;
  name: string;
};

export const updateAttribute = ({ attributeId, name }: UpdateAttributeInput) =>
  apiFetch<Attribute>(
    tokenizePath(CLIENT_BACKEND_PATHS.attribute, { id: attributeId }),
    {
      method: 'PATCH',
      body: {
        name,
      },
    }
  );

type UpdateAttributeValueInput = {
  attributeValueId: string | number;
  name: string;
  sortOrder: number;
};

export const updateAttributeValue = ({
  attributeValueId,
  name,
  sortOrder,
}: UpdateAttributeValueInput) =>
  apiFetch<AttributeValue>(
    tokenizePath(CLIENT_BACKEND_PATHS.attributeValue, { id: attributeValueId }),
    {
      method: 'PATCH',
      body: {
        name,
        sortOrder,
      },
    }
  );

type DeleteAttributesInput = {
  attributeIds: number[];
};

export const deleteAttributes = (input: DeleteAttributesInput) =>
  apiFetch<void>(CLIENT_BACKEND_PATHS.attributes, {
    method: 'DELETE',
    body: input,
  });

type DeleteAttributeValuesInput = {
  attributeValueIds: number[];
};

export const deleteAttributeValues = (input: DeleteAttributeValuesInput) =>
  apiFetch<void>(CLIENT_BACKEND_PATHS.attributeValuesDelete, {
    method: 'DELETE',
    body: input,
  });
