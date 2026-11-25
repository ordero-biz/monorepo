'use client';

import { useQuery } from '@tanstack/react-query';
import { getUnitsOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { unitsOfMeasurementListQueryOptions } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryOptions';
import type { PaginationSearchInput } from '@/lib/utils/url';

export const useUnitsOfMeasurementQuery = (input?: PaginationSearchInput) =>
  useQuery(unitsOfMeasurementListQueryOptions(getUnitsOfMeasurement, input));
