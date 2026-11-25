import type { TransferEntryFormValues } from '../types';

type MapTransferFieldErrorsArgs = {
  fieldErrors?: Record<string, string>;
  submittedEntryIds: readonly string[];
  currentEntries: readonly TransferEntryFormValues[];
};

export const mapTransferFieldErrors = ({
  fieldErrors,
  submittedEntryIds,
  currentEntries,
}: MapTransferFieldErrorsArgs): Record<string, string> => {
  const currentIndexes = new Map(
    currentEntries.map((entry, index) => [entry.clientId, index])
  );
  const mapped: Record<string, string> = {};

  for (const [name, message] of Object.entries(fieldErrors ?? {})) {
    let field = name
      .replace(/^(sourceWarehouse|destinationWarehouse)Id$/, '$1')
      .replace(/^transferEntries\.(\d+)(?=\.|$)/, 'transferEntries[$1]');
    const entryPath = /^transferEntries\[(\d+)\](.*)$/.exec(field);

    if (entryPath) {
      const clientId = submittedEntryIds[Number(entryPath[1])];
      const index =
        clientId === undefined ? undefined : currentIndexes.get(clientId);
      // Never attach an unknown or removed row's error to another product.
      if (index === undefined) continue;
      field = `transferEntries[${index}]${entryPath[2]}`.replace(
        /\.(productVariant|unitOfMeasurement)Id$/,
        '.stockItem'
      );
    }

    mapped[field] = message;
  }

  return mapped;
};
