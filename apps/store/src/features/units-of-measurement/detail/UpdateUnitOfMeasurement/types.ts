import type { UnitOfMeasurement } from '@/lib/domain/unitsOfMeasurement';

export type UpdateUnitOfMeasurementDialogProps = {
  onOpenChange: (open: boolean) => void;
  onUpdated: (unitOfMeasurement: UnitOfMeasurement) => Promise<void> | void;
  open: boolean;
  unitOfMeasurement: UnitOfMeasurement;
};

export type UpdateUnitOfMeasurementDialogTriggerProps = {
  onUpdated: (unitOfMeasurement: UnitOfMeasurement) => Promise<void> | void;
  unitOfMeasurement: UnitOfMeasurement;
};
