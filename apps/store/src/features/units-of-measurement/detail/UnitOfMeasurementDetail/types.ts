import type { UnitOfMeasurement } from '@/lib/domain/unitsOfMeasurement';

export type UnitOfMeasurementDetailProps = {
  unitOfMeasurementId: string;
};

export type UnitOfMeasurementDetailInfoProps = {
  unitOfMeasurement: UnitOfMeasurement;
};

export type UnitOfMeasurementDetailField = {
  label: string;
  value: UnitOfMeasurement[keyof UnitOfMeasurement];
};
