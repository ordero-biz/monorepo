import type { UnitOfMeasurement } from '@/lib/domain/units-of-measurement/types';

export type DeleteUnitsOfMeasurementDialogProps = {
  onDeleted?: () => void | Promise<void>;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  unitsOfMeasurement: UnitOfMeasurement[];
};
