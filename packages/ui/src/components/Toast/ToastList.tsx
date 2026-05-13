'use client';

import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import type { CSSProperties, ElementType } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/ui/lib/utils';
import './styles.css';
import {
  closeButtonClassName,
  closeButtonInnerClassName,
  closeIconClassName,
  defaultContentClassName,
  defaultRootSurfaceClassName,
  descriptionClassName,
  descriptionOnlyClassName,
  filledContentClassName,
  filledRootSurfaceClassName,
  iconClassName,
  iconContainerClassName,
  listContentClassName,
  listRootClassName,
  messageContainerClassName,
  stackContentClassName,
  stackRootClassName,
  titleClassName,
} from './classNames';
import type { ToastVariant, ToastViewportProps } from './types';
import { getToastAccessibleName, getToastVariant } from './utils';

const variantIcons: Record<Exclude<ToastVariant, 'default'>, ElementType> = {
  error: CircleAlert,
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
};

const iconColorClassNames: Record<Exclude<ToastVariant, 'default'>, string> = {
  error: 'bg-[var(--color-error-8)] text-[var(--color-error-main)]',
  info: 'bg-[var(--color-info-8)] text-[var(--color-info-main)]',
  success: 'bg-[var(--color-success-8)] text-[var(--color-success-main)]',
  warning: 'bg-[var(--color-warning-8)] text-[var(--color-warning-main)]',
};

const closeButtonColorClassNames: Record<ToastVariant, string> = {
  default: 'hover:bg-[var(--color-white-8)] hover:text-[var(--white-main)]',
  error: 'hover:text-[var(--text-primary)]',
  info: 'hover:text-[var(--text-primary)]',
  success: 'hover:text-[var(--text-primary)]',
  warning: 'hover:text-[var(--text-primary)]',
};

const listLayoutTransition =
  'transform 300ms cubic-bezier(0.45, 0, 0.55, 1), opacity 260ms ease-out';

type ToastLayoutRect = {
  left: number;
  top: number;
};

export const ToastList = ({
  layout = 'stack',
  swipeDirection,
}: Pick<ToastViewportProps, 'layout' | 'swipeDirection'>) => {
  const { toasts } = ToastPrimitive.useToastManager();
  const layoutRefreshTimeoutRef = useRef<
    ReturnType<typeof globalThis.setTimeout> | undefined
  >(undefined);
  const toastNodesRef = useRef(new Map<string, HTMLElement>());
  const previousRectsRef = useRef(new Map<string, ToastLayoutRect>());
  const toastHeightsRef = useRef(new Map<string, number>());
  const previousLimitedRef = useRef(new Map<string, boolean>());
  const [promotedToastIds, setPromotedToastIds] = useState<Set<string>>(
    () => new Set()
  );

  useEffect(() => {
    const nextLimitedMap = new Map(
      toasts.map((toast) => [toast.id, Boolean(toast.limited)])
    );

    if (layout !== 'list') {
      previousLimitedRef.current = nextLimitedMap;
      setPromotedToastIds((current) =>
        current.size > 0 ? new Set<string>() : current
      );

      return;
    }

    const promotedIds = toasts
      .filter(
        (toast) =>
          previousLimitedRef.current.get(toast.id) &&
          !toast.limited &&
          toast.transitionStatus !== 'ending'
      )
      .map((toast) => toast.id);

    previousLimitedRef.current = nextLimitedMap;

    setPromotedToastIds((current) => {
      const activeIds = new Set(toasts.map((toast) => toast.id));
      const next = new Set(
        Array.from(current).filter((toastId) => activeIds.has(toastId))
      );

      promotedIds.forEach((toastId) => {
        next.add(toastId);
      });

      if (
        next.size === current.size &&
        Array.from(next).every((toastId) => current.has(toastId))
      ) {
        return current;
      }

      return next;
    });

    if (promotedIds.length === 0) {
      return;
    }

    const timeoutId = globalThis.setTimeout(() => {
      setPromotedToastIds((current) => {
        const next = new Set(current);

        promotedIds.forEach((toastId) => {
          next.delete(toastId);
        });

        return next.size === current.size ? current : next;
      });
    }, 260);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [layout, toasts]);

  useLayoutEffect(() => {
    if (layout !== 'list') {
      previousRectsRef.current = new Map();

      if (layoutRefreshTimeoutRef.current) {
        globalThis.clearTimeout(layoutRefreshTimeoutRef.current);
      }

      return;
    }

    const getCurrentRects = () => {
      const currentRects = new Map<string, ToastLayoutRect>();

      toastNodesRef.current.forEach((node, toastId) => {
        const viewportRect = node.parentElement?.getBoundingClientRect();

        if (!viewportRect) {
          return;
        }

        currentRects.set(toastId, {
          left: viewportRect.left + node.offsetLeft,
          top: viewportRect.top + node.offsetTop,
        });
      });

      return currentRects;
    };

    const nextRects = getCurrentRects();

    if (layoutRefreshTimeoutRef.current) {
      globalThis.clearTimeout(layoutRefreshTimeoutRef.current);
    }

    nextRects.forEach((nextRect, toastId) => {
      const previousRect = previousRectsRef.current.get(toastId);
      const node = toastNodesRef.current.get(toastId);

      if (
        !previousRect ||
        !node ||
        node.hasAttribute('data-ending-style') ||
        getComputedStyle(node).transform !== 'none'
      ) {
        return;
      }

      const deltaX = previousRect.left - nextRect.left;
      const deltaY = previousRect.top - nextRect.top;

      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
        return;
      }

      node.style.transition = 'none';
      node.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

      requestAnimationFrame(() => {
        node.style.transition = listLayoutTransition;
        node.style.transform = '';

        globalThis.setTimeout(() => {
          if (node.style.transition === listLayoutTransition) {
            node.style.transition = '';
          }
        }, 320);
      });
    });

    previousRectsRef.current = nextRects;

    layoutRefreshTimeoutRef.current = globalThis.setTimeout(() => {
      previousRectsRef.current = getCurrentRects();
    }, 460);
  });

  useEffect(() => {
    const activeToastIds = new Set(toasts.map((toast) => toast.id));

    toasts.forEach((toast) => {
      if (toast.height && toast.height > 0) {
        toastHeightsRef.current.set(toast.id, toast.height);
      }
    });

    Array.from(toastHeightsRef.current.keys()).forEach((toastId) => {
      if (!activeToastIds.has(toastId)) {
        toastHeightsRef.current.delete(toastId);
      }
    });
  }, [toasts]);

  const renderedToasts =
    layout === 'list'
      ? toasts
      : toasts.filter(
          (toast) => !toast.limited || toast.transitionStatus === 'ending'
        );

  return renderedToasts.map((toast) => {
    const variant = getToastVariant(toast.type);
    const hasTitle = Boolean(toast.title);
    const hasDescription = Boolean(toast.description);
    const customIcon = toast.data?.icon;
    const isPromoted = promotedToastIds.has(toast.id);
    const rememberedHeight = toastHeightsRef.current.get(toast.id);
    const listEndingStyle =
      layout === 'list' &&
      toast.transitionStatus === 'ending' &&
      rememberedHeight
        ? ({
            '--toast-height': `${rememberedHeight}px`,
          } as CSSProperties)
        : undefined;
    const updateKey = toast.updateKey ?? 0;
    const isDeduplicated = updateKey > 0;
    const VariantIcon = variant === 'default' ? null : variantIcons[variant];
    const icon =
      customIcon ??
      (VariantIcon ? (
        <VariantIcon aria-hidden="true" className={iconClassName} />
      ) : null);

    return (
      <ToastPrimitive.Root
        key={toast.id}
        aria-label={getToastAccessibleName(toast.title)}
        className={cn(
          layout === 'list' ? listRootClassName : stackRootClassName,
          variant === 'default'
            ? defaultRootSurfaceClassName
            : filledRootSurfaceClassName
        )}
        data-promoted={isPromoted ? true : undefined}
        data-slot="toast"
        data-update-key={updateKey}
        ref={(node) => {
          if (node) {
            toastNodesRef.current.set(toast.id, node);
          } else {
            toastNodesRef.current.delete(toast.id);
          }
        }}
        swipeDirection={swipeDirection}
        style={listEndingStyle}
        toast={toast}
      >
        <ToastPrimitive.Content
          key={`${toast.id}-${updateKey}`}
          className={cn(
            layout === 'list' ? listContentClassName : stackContentClassName,
            variant === 'default'
              ? defaultContentClassName
              : filledContentClassName
          )}
          data-deduplicated={isDeduplicated ? true : undefined}
          data-slot="toast-content"
        >
          {icon ? (
            <div
              className={cn(
                iconContainerClassName,
                variant === 'default' ? null : iconColorClassNames[variant]
              )}
            >
              {icon}
            </div>
          ) : null}

          <div className={messageContainerClassName}>
            {hasTitle ? (
              <ToastPrimitive.Title className={titleClassName} />
            ) : null}

            {hasDescription ? (
              <ToastPrimitive.Description
                className={cn(
                  hasTitle ? descriptionClassName : descriptionOnlyClassName,
                  variant === 'default' && hasTitle
                    ? 'text-[var(--color-white-72)]'
                    : null,
                  variant === 'default' && !hasTitle
                    ? 'text-[var(--white-main)]'
                    : null
                )}
              />
            ) : null}
          </div>

          <ToastPrimitive.Close
            aria-label="Dismiss notification"
            className={cn(
              closeButtonClassName,
              closeButtonColorClassNames[variant]
            )}
            data-slot="toast-close"
          >
            <span className={closeButtonInnerClassName}>
              <X aria-hidden="true" className={closeIconClassName} />
            </span>
          </ToastPrimitive.Close>
        </ToastPrimitive.Content>
      </ToastPrimitive.Root>
    );
  });
};
