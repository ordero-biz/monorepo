import type { UnitOfMeasurement } from '@/lib/domain/units-of-measurement/types';

export type UnitOfMeasurementDetailProps = {
  unitOfMeasurementId: string;
};

export type UnitOfMeasurementDetailHeaderProps = {
  onDeleted: () => Promise<void> | void;
  unitOfMeasurement: UnitOfMeasurement;
};

export type ActivateUnitOfMeasurementDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  unitOfMeasurement: UnitOfMeasurement;
};

export type ActivateUnitOfMeasurementDialogTriggerProps = {
  unitOfMeasurement: UnitOfMeasurement;
};

export type UnitOfMeasurementDetailInfoProps = {
  unitOfMeasurement: UnitOfMeasurement;
};

export type UnitOfMeasurementDetailField = {
  label: string;
  value: UnitOfMeasurement[keyof UnitOfMeasurement];
};
