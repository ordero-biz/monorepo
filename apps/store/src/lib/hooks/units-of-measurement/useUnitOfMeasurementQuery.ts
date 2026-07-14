'use client';

import { useQuery } from '@tanstack/react-query';
import { getUnitOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { unitOfMeasurementQueryOptions } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryOptions';

export const useUnitOfMeasurementQuery = (
  unitOfMeasurementId: string | number
) =>
  useQuery(
    unitOfMeasurementQueryOptions(unitOfMeasurementId, getUnitOfMeasurement)
  );
