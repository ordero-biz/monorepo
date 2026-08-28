import type { UNIT_OF_MEASUREMENT_STATUS } from './constants';

export type UnitOfMeasurementStatus =
  (typeof UNIT_OF_MEASUREMENT_STATUS)[keyof typeof UNIT_OF_MEASUREMENT_STATUS];

export type UnitOfMeasurement = {
  id: number;
  name: string;
  status: UnitOfMeasurementStatus;
  symbol?: string | null;
  comment?: string | null;
};
