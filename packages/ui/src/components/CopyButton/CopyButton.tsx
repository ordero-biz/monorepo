'use client';

import { Check, Copy } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { IconButton } from '@/ui/components/IconButton';
import type { CopyButtonProps } from './types';

const DEFAULT_COPIED_DURATION_MS = 2000;

export const CopyButton = ({
  'aria-label': ariaLabel,
  color = 'default',
  copiedDurationMs = DEFAULT_COPIED_DURATION_MS,
  copiedLabel = 'Copied',
  copyLabel = 'Copy to clipboard',
  defaultCopied = false,
  disabled = false,
  onClick,
  onCopy,
  onCopyError,
  ref,
  size = 'm',
  title,
  value,
  variant = 'text',
  ...props
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(defaultCopied);
  const isMountedRef = useRef(true);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const resolvedIdleLabel = ariaLabel ?? copyLabel;
  const resolvedAriaLabel = copied ? copiedLabel : resolvedIdleLabel;
  const resolvedTitle = copied ? copiedLabel : (title ?? resolvedIdleLabel);

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    if (!navigator.clipboard?.writeText) {
      setCopied(false);
      onCopyError?.(new Error('Clipboard API is not available'));
      return;
    }

    try {
      await navigator.clipboard.writeText(value);

      if (!isMountedRef.current) {
        return;
      }

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      setCopied(true);
      onCopy?.(value);

      timeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, copiedDurationMs);
    } catch (error) {
      if (!isMountedRef.current) {
        return;
      }

      setCopied(false);
      onCopyError?.(error);
    }
  };

  return (
    <IconButton
      {...props}
      aria-label={resolvedAriaLabel}
      color={copied ? 'success' : color}
      disabled={disabled}
      onClick={handleClick}
      ref={ref}
      size={size}
      title={resolvedTitle}
      type="button"
      variant={variant}
    >
      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
    </IconButton>
  );
};
