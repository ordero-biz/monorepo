'use client';

import { useCallback, useEffect, useState } from 'react';
import type { FormMergeChoices } from '@/lib/utils/form/comparison/mergeFormValues';
import type { FormConflictDialogProps } from '../types';
import type {
  FormRefreshReview,
  FormRefreshSession,
  UseFormRefreshArgs,
} from './types';

export const useFormRefresh = <TRecord, TValues extends object>({
  baseline,
  latest,
  getVersion,
  getDefaultValues,
  isReadOnly,
  merge,
  form,
  onBaselineChange,
}: UseFormRefreshArgs<TRecord, TValues>) => {
  const baselineVersion = getVersion(baseline);
  const [review, setReview] = useState<FormRefreshReview<TRecord, TValues>>({
    baselineVersion,
    dismissedVersion: null,
    session: null,
  });
  // A successful save can advance the controlled baseline outside this hook.
  // Reset only review state before rendering children; keep the editor mounted.
  if (review.baselineVersion !== baselineVersion) {
    setReview({ baselineVersion, dismissedVersion: null, session: null });
  }
  const { dismissedVersion, session } = review;
  const version = getVersion(latest);
  const hasNewerVersion = version > baselineVersion;
  const latestIsReadOnly = isReadOnly?.(latest) ?? false;
  const hasPendingRefresh =
    hasNewerVersion && !form.isPristine && !form.isSubmitting;

  useEffect(() => {
    if (hasNewerVersion && form.isPristine && !form.isSubmitting) {
      form.reset(getDefaultValues(latest));
      onBaselineChange(latest);
    }
  }, [form, getDefaultValues, hasNewerVersion, latest, onBaselineChange]);

  const openReview = useCallback(() => {
    if (form.isSubmitting || !hasNewerVersion) {
      return;
    }
    setReview((previous) => ({
      ...previous,
      dismissedVersion: latestIsReadOnly ? null : version,
      session: latestIsReadOnly
        ? null
        : { baseline, current: form.getValues() },
    }));
  }, [baseline, form, hasNewerVersion, latestIsReadOnly, version]);

  const setSession = (session: FormRefreshSession<TRecord, TValues> | null) => {
    setReview((previous) => ({ ...previous, session }));
  };

  const applyRefresh = (
    snapshot: FormRefreshSession<TRecord, TValues>,
    choices: FormMergeChoices<Extract<keyof TValues, string>> = {}
  ) => {
    if (form.isSubmitting || latestIsReadOnly) {
      return;
    }
    if (!hasNewerVersion) {
      setSession(null);
      return;
    }
    const merged = merge({ ...snapshot, latest, choices });
    if (merged.hasUnresolvedConflicts) {
      setSession(snapshot);
      return;
    }

    // Keep saved defaults and pending edits separate so the form stays dirty.
    form.reset(getDefaultValues(latest));
    for (const field of merged.changedFields) {
      form.setFieldValue(field, merged.values[field]);
    }
    onBaselineChange(latest);
    setSession(null);
  };

  const closeReview = () => {
    setReview((previous) => ({
      ...previous,
      dismissedVersion: version,
      session: null,
    }));
  };

  const preview =
    session && !latestIsReadOnly ? merge({ ...session, latest }) : null;
  const conflictDialogProps: FormConflictDialogProps<
    Extract<keyof TValues, string>
  > | null =
    session && preview
      ? {
          conflicts: preview.conflicts,
          updates: preview.updates,
          revision: version,
          onApply: (choices) => applyRefresh(session, choices),
          onClose: closeReview,
        }
      : null;

  return {
    reviewValues:
      session && preview
        ? {
            baseline: getDefaultValues(session.baseline),
            current: session.current,
            latest: getDefaultValues(latest),
            merged: preview.values,
          }
        : null,
    hasPendingRefresh,
    latestIsReadOnly,
    openReview,
    noticeProps: {
      open:
        hasPendingRefresh &&
        (!session || latestIsReadOnly) &&
        dismissedVersion !== version,
      onClose: closeReview,
      onReview: openReview,
    },
    conflictDialogProps,
  };
};
