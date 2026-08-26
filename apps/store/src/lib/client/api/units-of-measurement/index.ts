'use client';

import { apiFetch } from '@ordero/api-client';
import type {
  UnitOfMeasurement,
  UnitOfMeasurementStatus,
} from '@/lib/domain/unitsOfMeasurement';
import type { PaginatedResponse } from '@/lib/server/types';
import { tokenizePath } from '@/lib/utils/tokenizePath';
import {
  getPaginationSearch,
  type PaginationSearchInput,
} from '@/lib/utils/url';
import { CLIENT_BACKEND_PATHS } from '../path';

type UnitsOfMeasurementListResponse = PaginatedResponse<UnitOfMeasurement>;

type CreateUnitOfMeasurementInput = {
  name: string;
  status: UnitOfMeasurementStatus;
  symbol: string;
  comment: string;
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

export const createUnitOfMeasurement = (input: CreateUnitOfMeasurementInput) =>
  apiFetch<UnitOfMeasurement>(CLIENT_BACKEND_PATHS.unitsOfMeasurement, {
    method: 'POST',
    body: input,
  });

type UpdateUnitOfMeasurementInput = {
  unitOfMeasurementId: string | number;
  name: string;
  status: UnitOfMeasurementStatus;
  symbol: string;
  comment: string;
};

export const updateUnitOfMeasurement = ({
  unitOfMeasurementId,
  name,
  status,
  symbol,
  comment,
}: UpdateUnitOfMeasurementInput) =>
  apiFetch<UnitOfMeasurement>(
    tokenizePath(CLIENT_BACKEND_PATHS.unitOfMeasurement, {
      id: unitOfMeasurementId,
    }),
    {
      method: 'PATCH',
      body: {
        name,
        status,
        symbol,
        comment,
      },
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
