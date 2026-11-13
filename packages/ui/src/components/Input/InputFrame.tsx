import {
  fieldSurfaceClassNames,
  fieldValueTypographyClassName,
  getFieldSurfaceStateClassName,
} from '@/ui/lib/fieldStyles';
import { cn } from '@/ui/lib/utils';
import type { InputFrameProps } from './types';

const inputFrameClassNames = {
  outlined: 'relative flex w-full min-w-0 px-[var(--textfield-outlined-px)]',
  filled:
    'relative flex w-full min-w-0 px-[var(--textfield-filled-pl)] pr-[var(--textfield-filled-pr)]',
} as const;

const inputFrameSizeClassNames = {
  outlined: {
    m: 'h-[var(--textfield-outlined-md-height)]',
    s: 'h-[var(--textfield-outlined-sm-height)]',
  },
  filled: {
    m: 'h-[var(--textfield-md-height)]',
    s: 'h-[var(--textfield-sm-height)]',
  },
} as const;

const inputClassName =
  'min-w-0 flex-1 border-0 bg-transparent p-0 outline-none placeholder:text-[var(--text-disabled)] disabled:cursor-not-allowed';

const adornmentClassName =
  'flex shrink-0 items-center justify-center leading-none text-[length:var(--input-value-size-desktop)] font-[var(--input-value-weight)]';

const startAdornmentClassName = 'mr-[var(--textfield-start-adornment-mr)]';

const endAdornmentClassName = 'ml-[8px] min-w-[24px]';

const iconSizeClassNames = {
  m: 'size-[20px]',
  s: 'size-[18px]',
} as const;

const getAdornmentColorClassName = () => 'text-[var(--text-secondary)]';

export const getInputClassName = (disabled: boolean) =>
  cn(
    fieldValueTypographyClassName,
    inputClassName,
    disabled ? 'text-[var(--text-disabled)]' : 'text-foreground'
  );

export const InputFrame = ({
  children,
  disabled = false,
  endAdornment,
  endIcon: EndIcon,
  focused = false,
  invalid = false,
  size = 'm',
  startAdornment,
  startIcon: StartIcon,
  variant = 'outlined',
}: InputFrameProps) => (
  <div
    className={cn(
      fieldSurfaceClassNames[variant],
      inputFrameClassNames[variant],
      inputFrameSizeClassNames[variant][size],
      getFieldSurfaceStateClassName({
        active: focused,
        disabled,
        invalid,
        variant,
      })
    )}
    data-slot="input"
  >
    <div className="flex min-w-0 flex-1 items-center">
      {startAdornment || StartIcon ? (
        <span
          className={cn(
            adornmentClassName,
            startAdornmentClassName,
            getAdornmentColorClassName()
          )}
        >
          {startAdornment}
          {StartIcon ? (
            <StartIcon className={cn('shrink-0', iconSizeClassNames[size])} />
          ) : null}
        </span>
      ) : null}
      {children}
      {endAdornment || EndIcon ? (
        <span
          className={cn(
            adornmentClassName,
            endAdornmentClassName,
            getAdornmentColorClassName()
          )}
        >
          {endAdornment}
          {EndIcon ? (
            <EndIcon className={cn('shrink-0', iconSizeClassNames[size])} />
          ) : null}
        </span>
      ) : null}
    </div>
  </div>
);
