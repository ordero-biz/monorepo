import type { Combobox2MultipleProps, Combobox2SingleProps } from '@ordero/ui';
import type { QueryKey } from '@tanstack/react-query';

export type AsyncCombobox2LoadOptionsArgs = {
  page: number;
  pageSize: number;
};

export type AsyncCombobox2LoadOptionsResult<TOption extends object> = {
  options: TOption[];
  nextPage?: number;
};

type AsyncCombobox2CommonProps<TOption extends object> = {
  loadOptions: (
    args: AsyncCombobox2LoadOptionsArgs
  ) => Promise<AsyncCombobox2LoadOptionsResult<TOption>>;
  queryKey: QueryKey;
  pageSize?: number;
  staticOptions?: TOption[];
  loadErrorText?: Combobox2SingleProps<TOption>['listErrorText'];
};

type AsyncOwnedProps = 'options' | 'loading' | 'loadingMore' | 'listErrorText';

export type AsyncCombobox2SingleProps<TOption extends object> = Omit<
  Combobox2SingleProps<TOption>,
  AsyncOwnedProps
> &
  AsyncCombobox2CommonProps<TOption>;

export type AsyncCombobox2MultipleProps<TOption extends object> = Omit<
  Combobox2MultipleProps<TOption>,
  AsyncOwnedProps
> &
  AsyncCombobox2CommonProps<TOption>;

export type AsyncCombobox2Props<TOption extends object> =
  | AsyncCombobox2SingleProps<TOption>
  | AsyncCombobox2MultipleProps<TOption>;
