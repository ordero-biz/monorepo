import type {
  AttributeStatus,
  AttributeValueStatus,
} from '@/lib/domain/attributes/types';

export type AttributeStatusChipProps = {
  status?: AttributeStatus | AttributeValueStatus;
};
