import type { FormConflictPolicy, FormRefreshAdapter } from '../types';

export type FormRefreshSession<TRecord, TValues extends object> = {
  baseline: TRecord;
  current: TValues;
};

export type FormRefreshReview<TRecord, TValues extends object> = {
  baselineVersion: number;
  dismissedVersion: number | null;
  session: FormRefreshSession<TRecord, TValues> | null;
};

export type UseFormRefreshArgs<TRecord, TValues extends object> = Pick<
  FormConflictPolicy<TRecord, TValues>,
  'getVersion' | 'getDefaultValues' | 'merge'
> & {
  baseline: TRecord;
  latest: TRecord;
  isReadOnly?: (record: TRecord) => boolean;
  form: FormRefreshAdapter<TValues>;
  onBaselineChange: (record: TRecord) => void;
};
