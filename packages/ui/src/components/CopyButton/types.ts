import type {
  IconButtonColor,
  IconButtonProps,
  IconButtonSize,
  IconButtonVariant,
} from '@/ui/components/IconButton';

export type CopyButtonColor = IconButtonColor;

export type CopyButtonSize = IconButtonSize;

export type CopyButtonVariant = IconButtonVariant;

export type CopyButtonProps = Omit<IconButtonProps, 'children' | 'type'> & {
  copiedDurationMs?: number;
  copiedLabel?: string;
  copyLabel?: string;
  defaultCopied?: boolean;
  onCopy?: (value: string) => void;
  onCopyError?: (error: unknown) => void;
  value: string;
};
