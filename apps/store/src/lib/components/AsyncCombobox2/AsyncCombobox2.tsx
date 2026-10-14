'use client';

import { Combobox2, type ComboboxChangeEventDetails } from '@ordero/ui';
import type { InfiniteData, QueryKey } from '@tanstack/react-query';
import { useInfiniteQuery } from '@tanstack/react-query';
import { type UIEvent, useMemo, useState } from 'react';
import type {
  AsyncCombobox2LoadOptionsResult,
  AsyncCombobox2Props,
} from './types';

const DEFAULT_PAGE_SIZE = 25;
const LOAD_MORE_SCROLL_OFFSET = 24;

export const AsyncCombobox2 = <TOption extends object>(
  props: AsyncCombobox2Props<TOption>
) => {
  const {
    defaultOpen,
    getOptionValue,
    invalid = false,
    loadErrorText = "We couldn't load options right now.",
    loadOptions,
    onListScroll,
    onOpenChange,
    open,
    pageSize = DEFAULT_PAGE_SIZE,
    queryKey,
    staticOptions,
  } = props;
  const [openState, setOpenState] = useState(defaultOpen ?? false);
  const isOpen = open ?? openState;
  const optionsQuery = useInfiniteQuery<
    AsyncCombobox2LoadOptionsResult<TOption>,
    Error,
    InfiniteData<AsyncCombobox2LoadOptionsResult<TOption>>,
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
    const optionsByValue = new Map(
      [...(staticOptions ?? []), ...loadedOptions].map((option) => [
        getOptionValue(option),
        option,
      ])
    );

    return [...optionsByValue.values()];
  }, [getOptionValue, optionsQuery.data?.pages, staticOptions]);
  const isInitialLoading =
    isOpen && optionsQuery.isFetching && !optionsQuery.data;

  const handleListScroll = async (event: UIEvent<HTMLDivElement>) => {
    onListScroll?.(event);

    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    const isNearBottom =
      scrollHeight - scrollTop - clientHeight <= LOAD_MORE_SCROLL_OFFSET;

    if (
      isNearBottom &&
      optionsQuery.hasNextPage &&
      !optionsQuery.isFetchingNextPage
    ) {
      await optionsQuery.fetchNextPage();
    }
  };

  const handleOpenChange = (
    nextOpen: boolean,
    details: ComboboxChangeEventDetails
  ) => {
    setOpenState(nextOpen);
    onOpenChange?.(nextOpen, details);
  };

  return props.multiple ? (
    <Combobox2<TOption>
      aria-describedby={props['aria-describedby']}
      aria-label={props['aria-label']}
      aria-labelledby={props['aria-labelledby']}
      autoComplete={props.autoComplete}
      autoFocus={props.autoFocus}
      defaultInputValue={props.defaultInputValue}
      disabled={props.disabled}
      emptyText={props.emptyText}
      endAdornment={props.endAdornment}
      endIcon={props.endIcon}
      errorIcon={props.errorIcon}
      errorText={props.errorText}
      helperIcon={props.helperIcon}
      helperText={props.helperText}
      id={props.id}
      inputValue={props.inputValue}
      label={props.label}
      name={props.name}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      onInputValueChange={props.onInputValueChange}
      onKeyDown={props.onKeyDown}
      placeholder={props.placeholder}
      readOnly={props.readOnly}
      ref={props.ref}
      required={props.required}
      size={props.size}
      startAdornment={props.startAdornment}
      startIcon={props.startIcon}
      variant={props.variant}
      getOptionValue={getOptionValue}
      getOptionLabel={props.getOptionLabel}
      renderOption={props.renderOption}
      isOptionDisabled={props.isOptionDisabled}
      defaultOpen={defaultOpen}
      invalid={invalid || optionsQuery.isError}
      listErrorText={optionsQuery.isError ? loadErrorText : undefined}
      loading={isInitialLoading}
      loadingMore={optionsQuery.isFetchingNextPage}
      loadingText={props.loadingText}
      onListScroll={handleListScroll}
      onOpenChange={handleOpenChange}
      open={isOpen}
      options={options}
      defaultValue={props.defaultValue}
      value={props.value}
      onValueChange={props.onValueChange}
      multiple
    />
  ) : (
    <Combobox2<TOption>
      aria-describedby={props['aria-describedby']}
      aria-label={props['aria-label']}
      aria-labelledby={props['aria-labelledby']}
      autoComplete={props.autoComplete}
      autoFocus={props.autoFocus}
      defaultInputValue={props.defaultInputValue}
      disabled={props.disabled}
      emptyText={props.emptyText}
      endAdornment={props.endAdornment}
      endIcon={props.endIcon}
      errorIcon={props.errorIcon}
      errorText={props.errorText}
      helperIcon={props.helperIcon}
      helperText={props.helperText}
      id={props.id}
      inputValue={props.inputValue}
      label={props.label}
      name={props.name}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      onInputValueChange={props.onInputValueChange}
      onKeyDown={props.onKeyDown}
      placeholder={props.placeholder}
      readOnly={props.readOnly}
      ref={props.ref}
      required={props.required}
      size={props.size}
      startAdornment={props.startAdornment}
      startIcon={props.startIcon}
      variant={props.variant}
      getOptionValue={getOptionValue}
      getOptionLabel={props.getOptionLabel}
      renderOption={props.renderOption}
      isOptionDisabled={props.isOptionDisabled}
      defaultOpen={defaultOpen}
      invalid={invalid || optionsQuery.isError}
      listErrorText={optionsQuery.isError ? loadErrorText : undefined}
      loading={isInitialLoading}
      loadingMore={optionsQuery.isFetchingNextPage}
      loadingText={props.loadingText}
      onListScroll={handleListScroll}
      onOpenChange={handleOpenChange}
      open={isOpen}
      options={options}
      defaultValue={props.defaultValue}
      value={props.value}
      onValueChange={props.onValueChange}
      multiple={false}
    />
  );
};
