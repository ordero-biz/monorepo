import type {
  ComboboxMultipleProps,
  ComboboxOption,
  ComboboxSingleProps,
} from '@ordero/ui';
import type { QueryKey } from '@tanstack/react-query';

export type AsyncComboboxLoadOptionsArgs = {
  page: number;
  pageSize: number;
};

export type AsyncComboboxLoadOptionsResult = {
  nextPage?: number;
  options: ComboboxOption[];
};

type AsyncComboboxCommonProps = {
  loadErrorText?: ComboboxSingleProps['listErrorText'];
  loadOptions: (
    args: AsyncComboboxLoadOptionsArgs
  ) => Promise<AsyncComboboxLoadOptionsResult>;
  onListScroll?: ComboboxSingleProps['onListScroll'];
  pageSize?: number;
  queryKey: QueryKey;
};

export type AsyncComboboxSingleProps = Omit<
  ComboboxSingleProps,
  'listErrorText' | 'loading' | 'loadingMore' | 'onListScroll' | 'options'
> &
  AsyncComboboxCommonProps;

export type AsyncComboboxMultipleProps = Omit<
  ComboboxMultipleProps,
  'listErrorText' | 'loading' | 'loadingMore' | 'onListScroll' | 'options'
> &
  AsyncComboboxCommonProps;

export type AsyncComboboxProps =
  | AsyncComboboxSingleProps
  | AsyncComboboxMultipleProps;
