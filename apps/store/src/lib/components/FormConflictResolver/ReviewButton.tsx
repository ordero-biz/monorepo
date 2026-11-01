'use client';

import { Button } from '@ordero/ui';
import { useFormConflictResolver } from './context';

export const ReviewButton = () => {
  const resolver = useFormConflictResolver();

  if (!resolver?.hasPendingChanges) {
    return null;
  }

  return (
    <Button
      aria-haspopup="dialog"
      color="warning"
      onClick={resolver.openReview}
      size="m"
      type="button"
      variant="soft"
    >
      Review updates
    </Button>
  );
};
