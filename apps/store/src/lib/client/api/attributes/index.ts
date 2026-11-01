'use client';

import { apiFetch } from '@ordero/api-client';
import type {
  Attribute,
  AttributeDropdown,
  AttributeStatus,
  AttributeValue,
  AttributeValueStatus,
} from '@/lib/domain/attributes/types';
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

export const getAttributesDropdown = () =>
  apiFetch<AttributeDropdown[]>(CLIENT_BACKEND_PATHS.attributesDropdown, {
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

type CreateAttributeValuesInput = {
  attributeId: string | number;
  attributeValues: {
    name: string;
    sortOrder: number;
    status: AttributeValueStatus;
  }[];
};

export const createAttributeValues = ({
  attributeId,
  attributeValues,
}: CreateAttributeValuesInput) =>
  apiFetch<AttributeValue[]>(
    tokenizePath(CLIENT_BACKEND_PATHS.attributeValuesBulk, {
      id: attributeId,
    }),
    {
      method: 'POST',
      body: {
        attributeValues,
      },
    }
  );

export type CreateAttributeData = {
  name: string;
  sortOrder: number;
  status: AttributeStatus;
  attributeValues: {
    name: string;
    sortOrder: number;
    status: AttributeValueStatus;
  }[];
};

export type UpdateAttributeFieldData = Partial<
  Pick<CreateAttributeData, 'name' | 'status'>
>;

export type UpdateAttributeData = UpdateAttributeFieldData & {
  attributeId: string | number;
};

export const createAttribute = (input: CreateAttributeData) =>
  apiFetch<Attribute>(CLIENT_BACKEND_PATHS.attributes, {
    method: 'POST',
    body: input,
  });

export const updateAttribute = ({
  attributeId,
  ...input
}: UpdateAttributeData) =>
  apiFetch<Attribute>(
    tokenizePath(CLIENT_BACKEND_PATHS.attribute, { id: attributeId }),
    {
      method: 'PATCH',
      body: input,
    }
  );

export type UpdateAttributeValueFieldData = Partial<
  Pick<AttributeValue, 'name' | 'sortOrder' | 'status'>
>;

export type UpdateAttributeValueData = UpdateAttributeValueFieldData & {
  attributeValueId: string | number;
};

export const updateAttributeValue = ({
  attributeValueId,
  ...input
}: UpdateAttributeValueData) =>
  apiFetch<AttributeValue>(
    tokenizePath(CLIENT_BACKEND_PATHS.attributeValue, { id: attributeValueId }),
    {
      method: 'PATCH',
      body: input,
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
