'use client';

import type { ComboboxChangeEventDetails } from '@ordero/ui';
import { Combobox } from '@ordero/ui';
import type { InfiniteData, QueryKey } from '@tanstack/react-query';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { UIEvent } from 'react';
import { useMemo, useState } from 'react';
import type {
  AsyncComboboxLoadOptionsResult,
  AsyncComboboxProps,
} from './types';

const DEFAULT_PAGE_SIZE = 25;
const LOAD_MORE_SCROLL_OFFSET = 24;

export const AsyncCombobox = (props: AsyncComboboxProps) => {
  const {
    defaultOpen,
    isOptionDisabled,
    invalid = false,
    loadErrorText = "We couldn't load options right now.",
    loadOptions,
    onListScroll,
    onOpenChange,
    open,
    pageSize = DEFAULT_PAGE_SIZE,
    queryKey,
    staticOptions = [],
    ...comboboxProps
  } = props;
  const [openState, setOpenState] = useState(defaultOpen ?? false);
  const isOpen = open ?? openState;
  const optionsQuery = useInfiniteQuery<
    AsyncComboboxLoadOptionsResult,
    Error,
    InfiniteData<AsyncComboboxLoadOptionsResult>,
    QueryKey,
    number
  >({
    enabled: isOpen,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      loadOptions({
        page: pageParam,
        pageSize,
      }),
    queryKey: [...queryKey, { pageSize }],
  });
  const options = useMemo(() => {
    const loadedOptions =
      optionsQuery.data?.pages.flatMap((page) => page.options) ?? [];

    return [...staticOptions, ...loadedOptions].map((option) => ({
      ...option,
      disabled: option.disabled || isOptionDisabled?.(option),
    }));
  }, [isOptionDisabled, optionsQuery.data?.pages, staticOptions]);
  const isInitialLoading =
    isOpen && optionsQuery.isFetching && !optionsQuery.data;

  const handleListScroll = (event: UIEvent<HTMLDivElement>) => {
    onListScroll?.(event);

    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    const isNearBottom =
      scrollHeight - scrollTop - clientHeight <= LOAD_MORE_SCROLL_OFFSET;

    if (
      isNearBottom &&
      optionsQuery.hasNextPage &&
      !optionsQuery.isFetchingNextPage
    ) {
      void optionsQuery.fetchNextPage();
    }
  };

  const handleOpenChange = (
    nextOpen: boolean,
    details: ComboboxChangeEventDetails
  ) => {
    setOpenState(nextOpen);
    onOpenChange?.(nextOpen, details);
  };

  return (
    <Combobox
      {...comboboxProps}
      defaultOpen={defaultOpen}
      invalid={invalid || optionsQuery.isError}
      listErrorText={optionsQuery.isError ? loadErrorText : undefined}
      loading={isInitialLoading}
      loadingMore={optionsQuery.isFetchingNextPage}
      onListScroll={handleListScroll}
      onOpenChange={handleOpenChange}
      open={isOpen}
      options={options}
    />
  );
};
