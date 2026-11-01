import type { ComboboxMultipleProps, ComboboxSingleProps } from '@ordero/ui';
import type { QueryKey } from '@tanstack/react-query';

export type AsyncComboboxLoadOptionsArgs = {
  page: number;
  pageSize: number;
};

export type AsyncComboboxLoadOptionsResult<TOption extends object> = {
  options: TOption[];
  nextPage?: number;
};

type AsyncComboboxCommonProps<TOption extends object> = {
  loadOptions: (
    args: AsyncComboboxLoadOptionsArgs
  ) => Promise<AsyncComboboxLoadOptionsResult<TOption>>;
  queryKey: QueryKey;
  pageSize?: number;
  staticOptions?: TOption[];
  loadErrorText?: ComboboxSingleProps<TOption>['listErrorText'];
};

type AsyncOwnedProps = 'options' | 'loading' | 'loadingMore' | 'listErrorText';

export type AsyncComboboxSingleProps<TOption extends object> = Omit<
  ComboboxSingleProps<TOption>,
  AsyncOwnedProps
> &
  AsyncComboboxCommonProps<TOption>;

export type AsyncComboboxMultipleProps<TOption extends object> = Omit<
  ComboboxMultipleProps<TOption>,
  AsyncOwnedProps
> &
  AsyncComboboxCommonProps<TOption>;

export type AsyncComboboxProps<TOption extends object> =
  | AsyncComboboxSingleProps<TOption>
  | AsyncComboboxMultipleProps<TOption>;
