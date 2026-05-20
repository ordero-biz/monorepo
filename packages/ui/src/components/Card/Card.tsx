'use client';

import { cva } from 'class-variance-authority';
import type { KeyboardEvent } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/ui/lib/utils';
import type {
  CardContentProps,
  CardDescriptionProps,
  CardDividerProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
} from './types';

const cardVariants = cva(
  'relative flex flex-col overflow-hidden rounded-[var(--card-radius)] transition-shadow duration-150',
  {
    variants: {
      variant: {
        filled:
          'bg-[var(--card)] text-[var(--card-foreground)] shadow-[var(--card-x1)_var(--card-y1)_var(--card-blur1)_var(--card-spread1)_var(--color-shadow-20),var(--card-x2)_var(--card-y2)_var(--card-blur2)_var(--card-spread2)_var(--color-shadow-12)]',
        outlined:
          'border border-[var(--color-divider)] bg-transparent text-foreground',
      },
    },
    defaultVariants: {
      variant: 'filled',
    },
  }
);

export const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  ({ children, id, onClick, variant }, ref) => {
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (onClick && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
      }
    };

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: role="button" is applied conditionally when onClick is provided
      <div
        ref={ref}
        id={id}
        onClick={onClick}
        onKeyDown={onClick ? handleKeyDown : undefined}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        className={cn(cardVariants({ variant }))}
        data-slot="card"
      >
        {children}
      </div>
    );
  }
);
CardRoot.displayName = 'CardRoot';

export const CardHeader = forwardRef<HTMLElement, CardHeaderProps>(
  ({ children, id }, ref) => {
    return (
      <header
        ref={ref}
        id={id}
        className="flex items-start justify-between gap-[var(--card-header-spacing)] pt-[var(--card-content-p)] px-[var(--card-content-p)] pb-[var(--spacing-2)]"
        data-slot="card-header"
      >
        {children}
      </header>
    );
  }
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, id }, ref) => {
    return (
      <h3
        ref={ref}
        id={id}
        className="text-[length:var(--subtitle1-size-desktop)] leading-[var(--subtitle1-line-height-desktop)] font-[var(--subtitle1-weight)] [font-family:var(--subtitle1-family)] text-[var(--text-primary)] font-semibold"
        data-slot="card-title"
      >
        {children}
      </h3>
    );
  }
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ children, id }, ref) => {
  return (
    <p
      ref={ref}
      id={id}
      className="text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] font-[var(--caption-weight)] [font-family:var(--caption-family)] text-[var(--text-secondary)] font-normal"
      data-slot="card-description"
    >
      {children}
    </p>
  );
});
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, id }, ref) => {
    return (
      <div
        ref={ref}
        id={id}
        className="p-[var(--card-content-p)]"
        data-slot="card-content"
      >
        {children}
      </div>
    );
  }
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLElement, CardFooterProps>(
  ({ children, id }, ref) => {
    return (
      <footer
        ref={ref}
        id={id}
        className="flex items-center gap-[var(--spacing-1-5)] p-[var(--card-content-p)] pt-0"
        data-slot="card-footer"
      >
        {children}
      </footer>
    );
  }
);
CardFooter.displayName = 'CardFooter';

export const CardDivider = forwardRef<HTMLHRElement, CardDividerProps>(
  ({ id, variant = 'dashed' }, ref) => {
    return (
      <hr
        ref={ref}
        id={id}
        className={cn(
          'w-full border-t border-[var(--color-divider)]',
          variant === 'dashed' && 'border-dashed'
        )}
        data-slot="card-divider"
      />
    );
  }
);
CardDivider.displayName = 'CardDivider';
