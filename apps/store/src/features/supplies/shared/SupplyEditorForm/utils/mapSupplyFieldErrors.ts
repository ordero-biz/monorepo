import type { SupplyEntryFormValues } from '../types';

type MapSupplyFieldErrorsArgs = {
  fieldErrors?: Record<string, string>;
  submittedEntryIds: readonly string[];
  currentEntries: readonly SupplyEntryFormValues[];
};

export const mapSupplyFieldErrors = ({
  fieldErrors,
  submittedEntryIds,
  currentEntries,
}: MapSupplyFieldErrorsArgs): Record<string, string> => {
  const currentIndexes = new Map(
    currentEntries.map((entry, index) => [entry.clientId, index])
  );
  const mapped: Record<string, string> = {};

  for (const [name, message] of Object.entries(fieldErrors ?? {})) {
    let field = name
      .replace(/^(supplier|warehouse)Id$/, '$1')
      .replace(/^supplyEntries\.(\d+)(?=\.|$)/, 'supplyEntries[$1]');
    const entryPath = /^supplyEntries\[(\d+)\](.*)$/.exec(field);

    if (entryPath) {
      const clientId = submittedEntryIds[Number(entryPath[1])];
      const index =
        clientId === undefined ? undefined : currentIndexes.get(clientId);
      // Never attach an unknown or removed row's error to another product.
      if (index === undefined) continue;
      field = `supplyEntries[${index}]${entryPath[2]}`.replace(
        /\.(productVariant|unitOfMeasurement)Id$/,
        '.$1'
      );
    }

    mapped[field] = message;
  }

  return mapped;
};
