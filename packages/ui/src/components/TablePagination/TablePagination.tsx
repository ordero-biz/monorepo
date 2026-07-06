'use client';

import { Switch as SwitchPrimitive } from '@base-ui/react/switch';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useId, useMemo, useState } from 'react';
import { IconButton } from '@/ui/components/IconButton';
import { Select } from '@/ui/components/Select';
import { cn } from '@/ui/lib/utils';
import type {
  TablePaginationProps,
  TablePaginationRangeLabelArgs,
} from './types';

const defaultRowsPerPageOptions = [5, 10, 25] as const;

const rootClassName =
  'flex min-h-[56px] w-full items-center justify-end gap-[var(--spacing-2-5)] overflow-hidden bg-card py-[var(--spacing-1-25)] pl-[var(--spacing-2)] pr-[var(--spacing-1)] text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] font-[var(--body2-weight)] text-card-foreground';

const denseSwitchClassName =
  'inline-flex shrink-0 cursor-pointer items-center gap-[var(--switch-md-spacing)] text-card-foreground';

const switchRootClassName =
  'relative inline-flex h-[20px] w-[var(--switch-md-width)] shrink-0 cursor-pointer items-center rounded-full bg-[var(--color-grey-40)] p-[var(--switch-p)] outline-none transition-[background-color,box-shadow] focus-visible:ring-3 focus-visible:ring-ring/50 data-[checked]:bg-primary data-[disabled]:cursor-not-allowed data-[disabled]:bg-[var(--color-grey-24)]';

const switchThumbClassName =
  'block size-[14px] rounded-full bg-card shadow-sm transition-transform data-[checked]:translate-x-[13px]';

const labelClassName = 'whitespace-nowrap text-card-foreground';

const rowsPerPageSelectWrapperClassName = 'min-w-[72px] shrink-0';

const actionsClassName = 'flex shrink-0 items-center';

const getBoundedPage = ({
  count,
  page,
  rowsPerPage,
}: {
  count: number;
  page: number;
  rowsPerPage: number;
}) => {
  if (count <= 0) {
    return 0;
  }

  const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);

  return Math.min(Math.max(0, page), lastPage);
};

const getDefaultRangeLabel = ({
  count,
  from,
  to,
}: TablePaginationRangeLabelArgs) => `${from}-${to} of ${count}`;

const getRange = ({
  count,
  page,
  rowsPerPage,
}: {
  count: number;
  page: number;
  rowsPerPage: number;
}) => {
  if (count <= 0) {
    return {
      from: 0,
      to: 0,
    };
  }

  const boundedPage = getBoundedPage({ count, page, rowsPerPage });
  const from = boundedPage * rowsPerPage + 1;
  const to = Math.min(count, (boundedPage + 1) * rowsPerPage);

  return {
    from,
    to,
  };
};

const getRowsPerPageOptions = ({
  rowsPerPage,
  rowsPerPageOptions,
}: {
  rowsPerPage: number;
  rowsPerPageOptions: readonly number[];
}) => {
  if (rowsPerPageOptions.includes(rowsPerPage)) {
    return rowsPerPageOptions;
  }

  return [...rowsPerPageOptions, rowsPerPage];
};

export const TablePagination = ({
  'aria-label': ariaLabel = 'Table pagination',
  count,
  defaultDense = false,
  dense,
  denseLabel = 'Dense',
  disabled = false,
  getRangeLabel = getDefaultRangeLabel,
  nextPageLabel = 'Go to next page',
  onDenseChange,
  onPageChange,
  onRowsPerPageChange,
  page,
  previousPageLabel = 'Go to previous page',
  rowsPerPage,
  rowsPerPageLabel = 'Rows per page:',
  rowsPerPageOptions = defaultRowsPerPageOptions,
  showDenseToggle = false,
}: TablePaginationProps) => {
  const generatedSwitchId = useId();
  const switchId = `${generatedSwitchId}-dense`;
  const [switchInputId, setSwitchInputId] = useState(switchId);
  const setSwitchInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      setSwitchInputId(node?.id ?? switchId);
    },
    [switchId]
  );
  const boundedPage = getBoundedPage({ count, page, rowsPerPage });
  const { from, to } = getRange({ count, page: boundedPage, rowsPerPage });
  const canGoPrevious = !disabled && boundedPage > 0;
  const canGoNext = !disabled && count > 0 && to < count;
  const normalizedRowsPerPageOptions = useMemo(
    () => getRowsPerPageOptions({ rowsPerPage, rowsPerPageOptions }),
    [rowsPerPage, rowsPerPageOptions]
  );
  const rowsPerPageItems = useMemo(
    () =>
      normalizedRowsPerPageOptions.map((option) => ({
        label: String(option),
        value: String(option),
      })),
    [normalizedRowsPerPageOptions]
  );
  const selectedRowsPerPage = String(rowsPerPage);
  const rangeLabel = getRangeLabel({
    count,
    from,
    page: boundedPage,
    rowsPerPage,
    to,
  });

  return (
    <nav
      aria-label={ariaLabel}
      className={rootClassName}
      data-slot="table-pagination"
    >
      {showDenseToggle ? (
        <label
          className={cn(
            denseSwitchClassName,
            disabled && 'cursor-not-allowed text-[var(--text-disabled)]'
          )}
          htmlFor={switchInputId}
        >
          <SwitchPrimitive.Root
            checked={dense}
            className={switchRootClassName}
            defaultChecked={dense === undefined ? defaultDense : undefined}
            disabled={disabled}
            id={switchId}
            inputRef={setSwitchInputRef}
            onCheckedChange={(checked, details) => {
              onDenseChange?.(checked, details);
            }}
          >
            <SwitchPrimitive.Thumb className={switchThumbClassName} />
          </SwitchPrimitive.Root>
          <span>{denseLabel}</span>
        </label>
      ) : null}
      <span className={cn(labelClassName, 'ml-auto')}>{rowsPerPageLabel}</span>
      <div className={rowsPerPageSelectWrapperClassName}>
        <Select
          aria-label="Rows per page"
          alignItemWithTrigger={false}
          disabled={disabled || !onRowsPerPageChange}
          onValueChange={(value, details) => {
            if (value === null) {
              return;
            }

            onRowsPerPageChange?.(Number(value), details);
          }}
          options={rowsPerPageItems}
          placeholder={selectedRowsPerPage}
          size="s"
          value={selectedRowsPerPage}
          variant="outlined"
          width="content"
        />
      </div>
      <span className={labelClassName}>{rangeLabel}</span>
      <div className={actionsClassName}>
        <IconButton
          aria-label={previousPageLabel}
          disabled={!canGoPrevious}
          onClick={() => onPageChange(boundedPage - 1)}
          size="s"
        >
          <ChevronLeft aria-hidden="true" />
        </IconButton>
        <IconButton
          aria-label={nextPageLabel}
          disabled={!canGoNext}
          onClick={() => onPageChange(boundedPage + 1)}
          size="s"
        >
          <ChevronRight aria-hidden="true" />
        </IconButton>
      </div>
    </nav>
  );
};
