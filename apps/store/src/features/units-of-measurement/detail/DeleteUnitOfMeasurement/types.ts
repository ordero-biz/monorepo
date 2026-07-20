import type { UnitOfMeasurement } from '@/lib/domain/unitsOfMeasurement';

export type DeleteUnitOfMeasurementDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  unitOfMeasurement: UnitOfMeasurement;
};
