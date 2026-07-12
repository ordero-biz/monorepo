'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { clientRoutes } from '@/lib/client/routes';
import { storesQueryKeys } from '@/lib/hooks/stores/useStoresQuery';
import { AddStoreLayout } from './AddStoreLayout';

export const AddStorePage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return (
    <AddStoreLayout
      onCreated={async () => {
        await queryClient.invalidateQueries({
          queryKey: storesQueryKeys.list,
        });
        router.push(clientRoutes.stores);
      }}
    />
  );
};
