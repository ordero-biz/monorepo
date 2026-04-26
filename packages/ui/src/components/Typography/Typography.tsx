import { cn } from '@/ui/lib/utils';
import type {
  TypographyColor,
  TypographyProps,
  TypographyVariant,
} from './types';

const variantClassNames: Record<TypographyVariant, string> = {
  h1: 'text-[length:var(--h1-size-mobile)] leading-[var(--h1-line-height-mobile)] font-[var(--h1-weight)] [font-family:var(--h1-family)] tracking-[var(--h1-letter-spacing)] md:text-[length:var(--h1-size-desktop)] md:leading-[var(--h1-line-height-desktop)]',
  h2: 'text-[length:var(--h2-size-mobile)] leading-[var(--h2-line-height-mobile)] font-[var(--h2-weight)] [font-family:var(--h2-family)] tracking-[var(--h2-letter-spacing)] md:text-[length:var(--h2-size-desktop)] md:leading-[var(--h2-line-height-desktop)]',
  h3: 'text-[length:var(--h3-size-mobile)] leading-[var(--h3-line-height-mobile)] font-[var(--h3-weight)] [font-family:var(--h3-family)] tracking-[var(--h3-letter-spacing)] md:text-[length:var(--h3-size-desktop)] md:leading-[var(--h3-line-height-desktop)]',
  h4: 'text-[length:var(--h4-size-mobile)] leading-[var(--h4-line-height-mobile)] font-[var(--h4-weight)] [font-family:var(--h4-family)] tracking-[var(--h4-letter-spacing)] md:text-[length:var(--h4-size-desktop)] md:leading-[var(--h4-line-height-desktop)]',
  h5: 'text-[length:var(--h5-size-mobile)] leading-[var(--h5-line-height-mobile)] font-[var(--h5-weight)] [font-family:var(--h5-family)] tracking-[var(--h5-letter-spacing)] md:text-[length:var(--h5-size-desktop)] md:leading-[var(--h5-line-height-desktop)]',
  h6: 'text-[length:var(--h6-size-mobile)] leading-[var(--h6-line-height-mobile)] font-[var(--h6-weight)] [font-family:var(--h6-family)] tracking-[var(--h6-letter-spacing)] md:text-[length:var(--h6-size-desktop)] md:leading-[var(--h6-line-height-desktop)]',
  subtitle1:
    'text-[length:var(--subtitle1-size-desktop)] leading-[var(--subtitle1-line-height-desktop)] font-[var(--subtitle1-weight)] [font-family:var(--subtitle1-family)] tracking-[var(--subtitle1-letter-spacing)]',
  subtitle2:
    'text-[length:var(--subtitle2-size-desktop)] leading-[var(--subtitle2-line-height-desktop)] font-[var(--subtitle2-weight)] [font-family:var(--subtitle2-family)] tracking-[var(--subtitle2-letter-spacing)]',
  body1:
    'text-[length:var(--body1-size-desktop)] leading-[var(--body1-line-height-desktop)] font-[var(--body1-weight)] [font-family:var(--body1-family)] tracking-[var(--body1-letter-spacing)]',
  body2:
    'text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] font-[var(--body2-weight)] [font-family:var(--body2-family)] tracking-[var(--body2-letter-spacing)]',
  caption:
    'text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] font-[var(--caption-weight)] [font-family:var(--caption-family)] tracking-[var(--caption-letter-spacing)]',
  overline:
    'text-[length:var(--overline-size-desktop)] leading-[var(--overline-line-height-desktop)] font-[var(--overline-weight)] [font-family:var(--overline-family)] tracking-[var(--overline-letter-spacing)] uppercase',
};

const colorClassNames: Record<TypographyColor, string> = {
  'text-primary': 'text-[var(--text-primary)]',
  'text-secondary': 'text-[var(--text-secondary)]',
  'text-disabled': 'text-[var(--text-disabled)]',
  primary: 'text-primary',
  secondary: 'text-[var(--secondary-main)]',
  info: 'text-[var(--info-main)]',
  success: 'text-[var(--success-main)]',
  warning: 'text-[var(--warning-main)]',
  error: 'text-[var(--error-main)]',
};

type TypographyElementName = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

const variantElementNames: Record<TypographyVariant, TypographyElementName> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'p',
  subtitle2: 'p',
  body1: 'p',
  body2: 'p',
  caption: 'p',
  overline: 'p',
};

export const Typography = ({
  children,
  color = 'text-primary',
  id,
  variant = 'body1',
}: TypographyProps) => {
  const Tag = variantElementNames[variant];

  return (
    <Tag
      className={cn(
        'min-w-0 text-pretty',
        variantClassNames[variant],
        colorClassNames[color]
      )}
      data-slot="typography"
      id={id}
    >
      {children}
    </Tag>
  );
};
