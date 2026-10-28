import type { UnitOfMeasurement } from '@/lib/domain/units-of-measurement/types';
import type { useUpdateUnitOfMeasurementForm } from './hooks/useUpdateUnitOfMeasurementForm';

export type UpdateUnitOfMeasurementDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  unitOfMeasurement: UnitOfMeasurement;
};

export type UpdateUnitOfMeasurementDialogTriggerProps = {
  unitOfMeasurement: UnitOfMeasurement;
};

export type UpdateUnitOfMeasurementDialogFormContentProps = {
  form: ReturnType<typeof useUpdateUnitOfMeasurementForm>['form'];
  isUnitOfMeasurementActive: boolean;
};
