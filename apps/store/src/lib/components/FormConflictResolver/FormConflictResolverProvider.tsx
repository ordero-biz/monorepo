'use client';

import { useMemo } from 'react';
import { FormConflictResolverContext } from './context';
import { FormConflictDialog } from './FormConflictDialog';
import { useFormRefresh } from './hooks/useFormRefresh';
import { SavedChangesDialog } from './SavedChangesDialog';
import type { FormConflictResolverProviderProps } from './types';

export const FormConflictResolverProvider = <TRecord, TValues extends object>({
  baseline,
  latest,
  onBaselineChange,
  form,
  policy,
  children,
}: FormConflictResolverProviderProps<TRecord, TValues>) => {
  const refresh = useFormRefresh({
    baseline,
    latest,
    onBaselineChange,
    form,
    getVersion: policy.getVersion,
    getDefaultValues: policy.getDefaultValues,
    merge: policy.merge,
    isReadOnly: policy.readOnly?.isReadOnly,
  });
  const { hasPendingRefresh, latestIsReadOnly, openReview } = refresh;
  const value = useMemo(
    () => ({
      hasPendingChanges: hasPendingRefresh,
      isReadOnly: latestIsReadOnly,
      openReview,
    }),
    [hasPendingRefresh, latestIsReadOnly, openReview]
  );
  const notice =
    latestIsReadOnly && policy.readOnly
      ? policy.readOnly.notice
      : policy.notice;

  return (
    <FormConflictResolverContext value={value}>
      {children}
      <SavedChangesDialog
        {...notice}
        onClose={refresh.noticeProps.onClose}
        open={refresh.noticeProps.open}
        reviewAction={
          latestIsReadOnly
            ? undefined
            : {
                label: 'Review updates',
                onClick: refresh.noticeProps.onReview,
              }
        }
      />
      {refresh.conflictDialogProps && (
        <FormConflictDialog
          {...refresh.conflictDialogProps}
          saveNotice={policy.saveNotice}
        />
      )}
    </FormConflictResolverContext>
  );
};
