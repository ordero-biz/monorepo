'use client';

import { apiFetch } from '@ordero/api-client';
import type {
  UnitOfMeasurement,
  UnitOfMeasurementStatus,
} from '@/lib/domain/units-of-measurement/types';
import type { PaginatedResponse } from '@/lib/server/types';
import { tokenizePath } from '@/lib/utils/tokenizePath';
import {
  getPaginationSearch,
  type PaginationSearchInput,
} from '@/lib/utils/url';
import { CLIENT_BACKEND_PATHS } from '../path';

type UnitsOfMeasurementListResponse = PaginatedResponse<UnitOfMeasurement>;

export type CreateUnitOfMeasurementData = {
  name: string;
  status: UnitOfMeasurementStatus;
  symbol?: string | null;
  comment?: string | null;
};

export type UpdateUnitOfMeasurementFieldData =
  Partial<CreateUnitOfMeasurementData>;

export type UpdateUnitOfMeasurementData = UpdateUnitOfMeasurementFieldData & {
  unitOfMeasurementId: string | number;
};

export const getUnitsOfMeasurementPath = (input?: PaginationSearchInput) =>
  `${CLIENT_BACKEND_PATHS.unitsOfMeasurement}?${getPaginationSearch(input)}`;

export const getUnitsOfMeasurement = (input?: PaginationSearchInput) =>
  apiFetch<UnitsOfMeasurementListResponse>(getUnitsOfMeasurementPath(input), {
    method: 'GET',
  });

export const getUnitOfMeasurement = (unitOfMeasurementId: string | number) =>
  apiFetch<UnitOfMeasurement>(
    tokenizePath(CLIENT_BACKEND_PATHS.unitOfMeasurement, {
      id: unitOfMeasurementId,
    }),
    {
      method: 'GET',
    }
  );

export const createUnitOfMeasurement = (input: CreateUnitOfMeasurementData) =>
  apiFetch<UnitOfMeasurement>(CLIENT_BACKEND_PATHS.unitsOfMeasurement, {
    method: 'POST',
    body: input,
  });

export const updateUnitOfMeasurement = ({
  unitOfMeasurementId,
  ...input
}: UpdateUnitOfMeasurementData) =>
  apiFetch<UnitOfMeasurement>(
    tokenizePath(CLIENT_BACKEND_PATHS.unitOfMeasurement, {
      id: unitOfMeasurementId,
    }),
    {
      method: 'PATCH',
      body: input,
    }
  );

type DeleteUnitsOfMeasurementInput = {
  unitOfMeasurementIds: number[];
};

export const deleteUnitsOfMeasurement = (
  input: DeleteUnitsOfMeasurementInput
) =>
  apiFetch<void>(CLIENT_BACKEND_PATHS.unitsOfMeasurement, {
    method: 'DELETE',
    body: input,
  });
