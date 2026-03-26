export type ButtonAppearance =
  | 'contained'
  | 'outlined'
  | 'text'
  | 'soft'
  | 'surface'
  | 'link';

export type ButtonColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

/** Legacy shadcn-style `variant` values → Minimal UI appearance + color */
const LEGACY_VARIANT_MAP: Record<
  string,
  { appearance: ButtonAppearance; color: ButtonColor }
> = {
  primary: { appearance: 'contained', color: 'primary' },
  secondary: { appearance: 'surface', color: 'default' },
  destructive: { appearance: 'contained', color: 'error' },
  outline: { appearance: 'outlined', color: 'default' },
  ghost: { appearance: 'text', color: 'default' },
  link: { appearance: 'link', color: 'primary' },
  /** Charcoal contained (Minimal “Default”) */
  dark: { appearance: 'contained', color: 'default' },
};

const APPEARANCES = new Set<string>([
  'contained',
  'outlined',
  'text',
  'soft',
  'surface',
  'link',
]);

export function resolveButtonStyle(
  variant: string | undefined,
  colorProp: ButtonColor | undefined
): { appearance: ButtonAppearance; color: ButtonColor } {
  const v = variant ?? 'contained';

  const legacy = LEGACY_VARIANT_MAP[v];
  if (legacy) {
    return {
      appearance: legacy.appearance,
      color: colorProp ?? legacy.color,
    };
  }

  if (APPEARANCES.has(v)) {
    const appearance = v as ButtonAppearance;
    if (appearance === 'link') {
      return { appearance, color: colorProp ?? 'primary' };
    }
    if (appearance === 'surface') {
      return { appearance, color: colorProp ?? 'default' };
    }
    return { appearance, color: colorProp ?? 'primary' };
  }

  return { appearance: 'contained', color: colorProp ?? 'primary' };
}
