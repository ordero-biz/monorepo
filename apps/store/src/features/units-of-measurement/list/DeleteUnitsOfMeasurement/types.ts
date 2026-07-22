import type { UnitOfMeasurement } from '@/lib/domain/unitsOfMeasurement';

export type DeleteUnitsOfMeasurementDialogProps = {
  onDeleted?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  unitsOfMeasurement: UnitOfMeasurement[];
};
