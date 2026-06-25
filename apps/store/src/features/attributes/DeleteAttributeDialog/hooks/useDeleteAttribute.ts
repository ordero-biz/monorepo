import { useToastManager } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteAttributes } from '@/lib/client/api/attributes';
import { clientRoutes } from '@/lib/client/routes';
import { attributesQueryKeys } from '@/lib/hooks/useAttributesQuery';

type UseDeleteAttributeArgs = {
  attributeId: number;
  attributeName: string;
  onDeleted: () => Promise<void> | void;
};

export const useDeleteAttribute = ({
  attributeId,
  attributeName,
  onDeleted,
}: UseDeleteAttributeArgs) => {
  const { add: addToast } = useToastManager();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    const result = await deleteAttributes({
      attributeIds: [attributeId],
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
      description: `Attribute ${attributeName} was deleted.`,
      type: 'success',
    });
    await onDeleted();
    queryClient.removeQueries({
      queryKey: attributesQueryKeys.detail(attributeId),
    });
    queryClient.removeQueries({
      queryKey: attributesQueryKeys.values(attributeId),
    });
    await queryClient.invalidateQueries({
      queryKey: attributesQueryKeys.list,
    });
    router.push(clientRoutes.attributes);
  };

  return {
    handleDelete,
    isDeleting,
  };
};
