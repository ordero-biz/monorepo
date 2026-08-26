export const UNIT_OF_MEASUREMENT_STATUS = {
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
} as const;

export type UnitOfMeasurementStatus =
  (typeof UNIT_OF_MEASUREMENT_STATUS)[keyof typeof UNIT_OF_MEASUREMENT_STATUS];

export type UnitOfMeasurement = {
  id: number;
  name: string;
  status: UnitOfMeasurementStatus;
  symbol: string;
  comment: string;
};
