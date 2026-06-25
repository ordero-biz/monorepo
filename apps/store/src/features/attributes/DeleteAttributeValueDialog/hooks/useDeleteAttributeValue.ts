import { useToastManager } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { deleteAttributeValues } from '@/lib/client/api/attributes';
import { attributesQueryKeys } from '@/lib/hooks/useAttributesQuery';

type UseDeleteAttributeValueArgs = {
  attributeId: string | number;
  attributeValueId: number;
  attributeValueName: string;
  onDeleted: () => Promise<void> | void;
};

export const useDeleteAttributeValue = ({
  attributeId,
  attributeValueId,
  attributeValueName,
  onDeleted,
}: UseDeleteAttributeValueArgs) => {
  const { add: addToast } = useToastManager();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    const result = await deleteAttributeValues({
      attributeValueIds: [attributeValueId],
    });

    setIsDeleting(false);

    if (!result.ok) {
      addToast({
        description: result.error.message,
        type: 'error',
      });
      return;
    }

    addToast({
      description: `Attribute value ${attributeValueName} was deleted.`,
      type: 'success',
    });
    await onDeleted();
    await queryClient.invalidateQueries({
      queryKey: attributesQueryKeys.values(attributeId),
    });
  };

  return {
    handleDelete,
    isDeleting,
  };
};
