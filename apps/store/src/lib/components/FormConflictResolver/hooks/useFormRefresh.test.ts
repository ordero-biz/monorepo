import { act, renderHook } from '@testing-library/react';
import { useState } from 'react';
import { mergeFormValues } from '@/lib/utils/form/comparison/mergeFormValues';
import type { UseFormRefreshArgs } from './types';
import { useFormRefresh } from './useFormRefresh';

type Values = { title: string; comment: string };
type SavedRecord = { version: number; locked: boolean; values: Values };

const initial: SavedRecord = {
  version: 1,
  locked: false,
  values: { title: 'Original', comment: '' },
};
const getVersion = (record: SavedRecord) => record.version;
const getDefaultValues = (record: SavedRecord) => record.values;
const isReadOnly = (record: SavedRecord) => record.locked;
const merge: UseFormRefreshArgs<SavedRecord, Values>['merge'] = ({
  baseline,
  current,
  latest,
  choices,
}) =>
  mergeFormValues({
    baseline: baseline.values,
    current,
    latest: latest.values,
    choices,
    fields: {
      title: { label: 'Title', describe: String },
      comment: { label: 'Comment', describe: String },
    },
  });

const setupRefresh = (
  options: {
    values?: Values;
    latest?: SavedRecord;
    isPristine?: boolean;
    isSubmitting?: boolean;
  } = {}
) => {
  let values = options.values ?? initial.values;
  const reset = vi.fn((defaults: Values) => {
    values = defaults;
  });
  const setFieldValue = vi.fn((field: keyof Values, value: string) => {
    values = { ...values, [field]: value };
  });
  let props = {
    latest: options.latest ?? initial,
    isPristine: options.isPristine ?? false,
    isSubmitting: options.isSubmitting ?? false,
  };
  const hook = renderHook(
    ({ latest, isPristine, isSubmitting }) => {
      const [baseline, setBaseline] = useState(initial);
      const refresh = useFormRefresh({
        baseline,
        latest,
        getVersion,
        getDefaultValues,
        isReadOnly,
        merge,
        onBaselineChange: setBaseline,
        form: {
          isPristine,
          isSubmitting,
          getValues: () => values,
          reset,
          setFieldValue,
        },
      });
      return { ...refresh, baseline, setBaseline };
    },
    { initialProps: props }
  );

  return {
    result: hook.result,
    reset,
    setFieldValue,
    getValues: () => values,
    edit: (next: Values) => {
      values = next;
    },
    rerender: (updates: Partial<typeof props>) => {
      props = { ...props, ...updates };
      hook.rerender(props);
    },
  };
};

describe('useFormRefresh', () => {
  it('accepts newer data automatically only for a pristine idle form', () => {
    const latest = {
      ...initial,
      version: 2,
      values: { ...initial.values, title: 'Saved' },
    };
    const { result, reset, rerender, getValues } = setupRefresh({
      isPristine: true,
    });
    rerender({ latest });
    expect(result.current.baseline).toEqual(latest);
    expect(getValues()).toEqual(latest.values);
    expect(reset).toHaveBeenCalledOnce();
    expect(result.current.noticeProps.open).toBe(false);
    rerender({ latest: initial });
    expect(result.current.baseline).toEqual(latest);
    expect(reset).toHaveBeenCalledOnce();
  });

  it('opens a review directly after dismissing the notice and announces the next version after cancellation', () => {
    const latest = { ...initial, version: 2 };
    const { result, reset, rerender } = setupRefresh({ latest });
    expect(result.current.noticeProps.open).toBe(true);
    act(() => result.current.noticeProps.onClose());
    rerender({ latest: { ...latest } });
    expect(result.current.noticeProps.open).toBe(false);
    act(() => result.current.openReview());
    expect(result.current.noticeProps.open).toBe(false);
    expect(result.current.conflictDialogProps).not.toBeNull();
    act(() => result.current.conflictDialogProps?.onClose());
    rerender({ latest: { ...latest, version: 3 } });
    expect(result.current.noticeProps.open).toBe(true);
    expect(reset).not.toHaveBeenCalled();
  });

  it('reads current edits at review time and restores them as dirty fields against saved defaults', () => {
    const latest = {
      ...initial,
      version: 2,
      values: { ...initial.values, title: 'Saved' },
    };
    const { result, edit, getValues, reset, setFieldValue } = setupRefresh({
      latest,
    });
    act(() => result.current.noticeProps.onClose());
    edit({ ...initial.values, comment: 'Typed after dismissal' });
    act(() => result.current.openReview());
    expect(reset).not.toHaveBeenCalled();
    expect(setFieldValue).not.toHaveBeenCalled();
    expect(result.current.baseline).toEqual(initial);
    expect(result.current.conflictDialogProps?.updates).toEqual([
      {
        field: 'title',
        label: 'Title',
        currentValue: 'Original',
        mergedValue: 'Saved',
      },
    ]);
    expect(getValues()).toEqual({
      ...initial.values,
      comment: 'Typed after dismissal',
    });
    act(() => result.current.conflictDialogProps?.onApply({}));
    expect(reset).toHaveBeenCalledExactlyOnceWith(latest.values);
    expect(setFieldValue).toHaveBeenCalledExactlyOnceWith(
      'comment',
      'Typed after dismissal'
    );
    expect(getValues()).toEqual({
      title: 'Saved',
      comment: 'Typed after dismissal',
    });
    expect(result.current.baseline).toEqual(latest);
    expect(result.current.conflictDialogProps).toBeNull();
    expect(result.current.noticeProps.open).toBe(false);
  });

  it('holds the original baseline until every conflict is resolved and uses the latest revision', () => {
    const latest = {
      ...initial,
      version: 2,
      values: { title: 'Saved', comment: '' },
    };
    const { result, reset, rerender, getValues } = setupRefresh({
      latest,
      values: { title: 'Local', comment: '' },
    });
    act(() => result.current.noticeProps.onReview());
    expect(result.current.conflictDialogProps?.conflicts[0].field).toBe(
      'title'
    );
    expect(result.current.noticeProps.open).toBe(false);
    act(() => result.current.conflictDialogProps?.onApply({}));
    expect(reset).not.toHaveBeenCalled();
    expect(result.current.baseline).toEqual(initial);
    const newer = {
      ...latest,
      version: 3,
      values: { ...latest.values, title: 'Newer saved' },
    };
    rerender({ latest: newer });
    expect(result.current.conflictDialogProps?.revision).toBe(3);
    expect(result.current.conflictDialogProps?.conflicts[0].serverValue).toBe(
      'Newer saved'
    );
    act(() => result.current.conflictDialogProps?.onApply({ title: 'server' }));
    expect(getValues()).toEqual(newer.values);
    expect(result.current.baseline).toEqual(newer);
    expect(result.current.conflictDialogProps).toBeNull();
  });

  it('updates an automatic preview when a newer version introduces a conflict', () => {
    const local = { title: 'Original', comment: 'Unsaved note' };
    const latest = {
      ...initial,
      version: 2,
      values: { title: 'Saved', comment: '' },
    };
    const { result, reset, rerender, getValues } = setupRefresh({
      latest,
      values: local,
    });
    act(() => result.current.openReview());
    expect(result.current.conflictDialogProps?.conflicts).toEqual([]);
    const newer = {
      ...latest,
      version: 3,
      values: { title: 'Newer saved', comment: 'Competing note' },
    };
    rerender({ latest: newer });
    expect(result.current.noticeProps.open).toBe(false);
    expect(result.current.conflictDialogProps?.updates[0].mergedValue).toBe(
      'Newer saved'
    );
    expect(result.current.conflictDialogProps?.conflicts[0].field).toBe(
      'comment'
    );
    act(() => result.current.conflictDialogProps?.onApply({}));
    expect(reset).not.toHaveBeenCalled();
    expect(getValues()).toEqual(local);
    expect(result.current.baseline).toEqual(initial);
    act(() =>
      result.current.conflictDialogProps?.onApply({ comment: 'local' })
    );
    expect(getValues()).toEqual({
      title: 'Newer saved',
      comment: 'Unsaved note',
    });
    expect(result.current.baseline).toEqual(newer);
  });

  it('replaces an automatic preview with a read-only notice without accepting any updates', () => {
    const local = { title: 'Original', comment: 'Unsaved note' };
    const latest = {
      ...initial,
      version: 2,
      values: { title: 'Saved', comment: '' },
    };
    const { result, reset, rerender, getValues } = setupRefresh({
      latest,
      values: local,
    });
    act(() => result.current.openReview());
    expect(result.current.conflictDialogProps?.updates).toHaveLength(1);
    rerender({ latest: { ...latest, version: 3, locked: true } });
    expect(result.current.conflictDialogProps).toBeNull();
    expect(result.current.noticeProps.open).toBe(true);
    expect(getValues()).toEqual(local);
    expect(result.current.baseline).toEqual(initial);
    expect(reset).not.toHaveBeenCalled();
  });

  it.each([
    'Local',
    'Original',
  ])('cancels a review without changing the form or baseline (local title: %s)', (title) => {
    const local = { title, comment: 'Unsaved note' };
    const latest = {
      ...initial,
      version: 2,
      values: { title: 'Saved', comment: '' },
    };
    const { result, reset, getValues } = setupRefresh({
      latest,
      values: local,
    });
    act(() => result.current.noticeProps.onReview());
    act(() => result.current.conflictDialogProps?.onClose());
    expect(result.current.conflictDialogProps).toBeNull();
    expect(result.current.noticeProps.open).toBe(false);
    expect(result.current.baseline).toEqual(initial);
    expect(getValues()).toEqual(local);
    expect(reset).not.toHaveBeenCalled();
  });

  it.each([
    true,
    false,
  ])('defers refresh while submitting (pristine: %s)', (isPristine) => {
    const latest = { ...initial, version: 2 };
    const { result, reset, rerender } = setupRefresh({
      latest,
      isPristine,
      isSubmitting: true,
    });
    expect(result.current.noticeProps.open).toBe(false);
    act(() => result.current.noticeProps.onReview());
    expect(reset).not.toHaveBeenCalled();
    expect(result.current.baseline).toEqual(initial);
    rerender({ isSubmitting: false });
    if (isPristine) {
      expect(result.current.baseline).toEqual(latest);
    } else {
      expect(result.current.noticeProps.open).toBe(true);
    }
  });

  it('blocks refreshing a read-only record without merging away pending edits', () => {
    const local = { ...initial.values, comment: 'Unsaved' };
    const latest = { ...initial, version: 2, locked: true };
    const { result, reset, getValues } = setupRefresh({
      latest,
      values: local,
    });
    expect(result.current.latestIsReadOnly).toBe(true);
    act(() => result.current.noticeProps.onReview());
    expect(result.current.noticeProps.open).toBe(true);
    expect(result.current.conflictDialogProps).toBeNull();
    act(() => result.current.noticeProps.onClose());
    expect(result.current.noticeProps.open).toBe(false);
    expect(getValues()).toEqual(local);
    expect(result.current.baseline).toEqual(initial);
    expect(reset).not.toHaveBeenCalled();
  });

  it('accepts a successful save and subsequently catches up with a newer cached version', () => {
    const latest = {
      ...initial,
      version: 3,
      values: { title: 'Latest', comment: 'Saved' },
    };
    const saved = {
      ...initial,
      version: 2,
      values: { ...initial.values, comment: 'Saved' },
    };
    const { result, rerender, getValues, reset } = setupRefresh({
      latest,
      isSubmitting: true,
    });
    act(() => {
      reset(saved.values);
      result.current.setBaseline(saved);
    });
    expect(result.current.baseline).toEqual(saved);
    expect(getValues()).toEqual(saved.values);
    rerender({ isSubmitting: false, isPristine: true });
    expect(result.current.baseline).toEqual(latest);
    expect(getValues()).toEqual(latest.values);
    rerender({ latest: saved });
    expect(result.current.baseline).toEqual(latest);
    expect(getValues()).toEqual(latest.values);
  });

  it('starts a fresh review when an external save advances the baseline while newer changes remain', () => {
    const latest = {
      ...initial,
      version: 3,
      values: { title: 'Latest', comment: '' },
    };
    const saved = {
      ...initial,
      version: 2,
      values: { title: 'Saved locally', comment: '' },
    };
    const { result, edit } = setupRefresh({
      latest,
      values: { title: 'Original draft', comment: '' },
    });
    act(() => result.current.noticeProps.onReview());
    expect(result.current.conflictDialogProps).not.toBeNull();

    act(() => result.current.setBaseline(saved));
    edit({ title: 'Edited after saving', comment: '' });
    expect(result.current.conflictDialogProps).toBeNull();
    expect(result.current.noticeProps.open).toBe(true);
    act(() => result.current.noticeProps.onReview());
    expect(result.current.conflictDialogProps?.conflicts[0].localValue).toBe(
      'Edited after saving'
    );
  });
});
