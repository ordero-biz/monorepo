const fallbackLocales = ['en-US', 'de-DE', 'fr-FR', 'de-CH', 'en-IN', 'ar-EG'];
const spaceSeparators = /[ \u00a0\u202f]/g;

const escapePattern = (symbol: string) =>
  symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const createNumberSyntax = (locale: string) => {
  const formatter = new Intl.NumberFormat(locale);
  const parts = formatter.formatToParts(-1234567890123.5);
  const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.';
  const group = parts.find((part) => part.type === 'group')?.value;
  const minus = parts.find((part) => part.type === 'minusSign')?.value ?? '-';
  const numerals = Array.from(
    new Intl.NumberFormat(locale, { useGrouping: false }).format(9876543210)
  ).reverse();
  const nonAsciiNumerals = numerals
    .filter(
      (digit) => /^\p{Decimal_Number}$/u.test(digit) && !/[0-9]/.test(digit)
    )
    .join('');
  const numeralPattern = nonAsciiNumerals
    ? new RegExp(`[${nonAsciiNumerals}]`, 'gu')
    : undefined;
  const groups = parts.filter((part) => part.type === 'integer');
  const lastGroup = groups.at(-1);
  const middleGroup = groups.at(-2);
  const spaceGrouping = group !== undefined && /^\p{Zs}$/u.test(group);
  let integerPattern = '[0-9]+';

  if (group && lastGroup && middleGroup) {
    const separator = escapePattern(group);
    const firstWidth = Array.from(middleGroup.value).length;
    const lastWidth = Array.from(lastGroup.value).length;
    const grouped = `[0-9]{1,${firstWidth}}(?:${separator}[0-9]{${firstWidth}})*${separator}[0-9]{${lastWidth}}`;
    integerPattern = `(?:${integerPattern}|${grouped})`;
  }

  const point = escapePattern(decimal);
  const pattern = new RegExp(
    `^[+-]?(?:${integerPattern}(?:${point}[0-9]*)?|${point}[0-9]+)$`
  );

  const read = (text: string) => {
    const signed = text.replace(minus, '-').replace('−', '-');
    const digits = numeralPattern
      ? signed.replace(numeralPattern, (digit) =>
          String(numerals.indexOf(digit))
        )
      : signed;
    const normalized =
      spaceGrouping && group ? digits.replace(spaceSeparators, group) : digits;

    if (!pattern.test(normalized)) {
      return undefined;
    }

    const ungrouped = group ? normalized.replaceAll(group, '') : normalized;
    return ungrouped.replace(decimal, '.');
  };

  return { decimal, read };
};

const syntaxByLocale = new Map<string, ReturnType<typeof createNumberSyntax>>();

const getNumberSyntax = (locale: string) => {
  let syntax = syntaxByLocale.get(locale);
  if (!syntax) {
    syntax = createNumberSyntax(locale);
    syntaxByLocale.set(locale, syntax);
  }
  return syntax;
};

export const localizeNumberPaste = (clipboardText: string, locale: string) => {
  const text = clipboardText.replace(/\p{Bidi_Control}/gu, '').trim();
  const target = getNumberSyntax(locale);
  const localNumber = target.read(text);

  if (localNumber !== undefined) {
    return { text: localNumber.replace('.', target.decimal) } as const;
  }

  let accepted: string | undefined;
  for (const fallbackLocale of fallbackLocales) {
    if (fallbackLocale === locale) {
      continue;
    }
    const candidate = getNumberSyntax(fallbackLocale).read(text);
    if (candidate === undefined) {
      continue;
    }
    if (accepted !== undefined && Number(accepted) !== Number(candidate)) {
      return { reason: 'ambiguous' } as const;
    }
    accepted = candidate;
  }

  return accepted === undefined
    ? ({ reason: 'unsupported' } as const)
    : ({ text: accepted.replace('.', target.decimal) } as const);
};
