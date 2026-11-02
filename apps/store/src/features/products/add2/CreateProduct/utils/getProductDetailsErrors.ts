import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import type { ProductVariantsCreationFormApi } from '../../../add/CreateProduct';
import type { ProductDetailsErrors } from '../types';

const detailFields = ['name', 'category', 'status', 'description'] as const;

export const getProductDetailsErrors = (
  fieldErrors: Record<string, string>
): ProductDetailsErrors =>
  Object.fromEntries(
    detailFields.flatMap((name) =>
      fieldErrors[name] ? [[name, fieldErrors[name]]] : []
    )
  );

export const getProductDetailsFormErrors = ({
  fieldMeta,
  submissionAttempts,
}: Pick<
  ProductVariantsCreationFormApi['state'],
  'fieldMeta' | 'submissionAttempts'
>): ProductDetailsErrors =>
  Object.fromEntries(
    detailFields.flatMap((name) => {
      const meta = fieldMeta[name];
      const error =
        meta && getFieldSubmitChangeErrorText(meta, submissionAttempts);
      return error ? [[name, error]] : [];
    })
  );
