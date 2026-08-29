import type { UnitOfMeasurement } from '@/lib/domain/units-of-measurement/types';
import type { useUpdateUnitOfMeasurementForm } from './hooks/useUpdateUnitOfMeasurementForm';

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

export type UpdateUnitOfMeasurementDialogFormContentProps = {
  form: ReturnType<typeof useUpdateUnitOfMeasurementForm>['form'];
  isUnitOfMeasurementActive: boolean;
};
