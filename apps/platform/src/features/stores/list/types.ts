import type { Store } from '@/lib/server/types';

export type AddStoreCardProps = {
  onClick: () => void;
};

export type StoreCardProps = {
  store: Store;
};
