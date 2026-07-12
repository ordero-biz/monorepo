'use client';

import { AttributeDetailHeader } from './AttributeDetailHeader';
import { AttributeDetailValues } from './AttributeDetailValues';
import type { AttributeDetailProps } from './types';

export const AttributeDetail = ({ attributeId }: AttributeDetailProps) => {
  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <AttributeDetailHeader attributeId={attributeId} />
      <AttributeDetailValues attributeId={attributeId} />
    </div>
  );
};
