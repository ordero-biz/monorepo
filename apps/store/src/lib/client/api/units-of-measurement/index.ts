'use client';

import { apiFetch } from '@ordero/api-client';
import type { UnitOfMeasurement } from '@/lib/domain/unitsOfMeasurement';
import type { PaginatedResponse } from '@/lib/server/types';
import { tokenizePath } from '@/lib/utils/tokenizePath';
import {
  getPaginationSearch,
  type PaginationSearchInput,
} from '@/lib/utils/url';
import { CLIENT_BACKEND_PATHS } from '../path';

type UnitsOfMeasurementListResponse = PaginatedResponse<UnitOfMeasurement>;

type CreateUnitOfMeasurementInput = {
  code: string;
  name: string;
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
