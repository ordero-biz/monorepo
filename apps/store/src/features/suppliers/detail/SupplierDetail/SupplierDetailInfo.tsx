import type { Supplier } from '@/lib/domain/suppliers';
import { Card, Typography } from '@/ui/index';
import type { SupplierDetailField, SupplierDetailInfoProps } from './types';

const getSupplierDetailData = (supplier: Supplier): SupplierDetailField[] => [
  {
    label: 'Email',
    value: supplier.email,
  },
  {
    label: 'Phone',
    value: supplier.phone,
  },
  {
    label: 'Address',
    value: supplier.address,
  },
  {
    label: 'Comment',
    value: supplier.comment,
  },
];

export const SupplierDetailInfo = ({ supplier }: SupplierDetailInfoProps) => {
  return (
    <Card.Root variant="filled">
      <Card.Header>
        <Card.Title>Supplier details</Card.Title>
      </Card.Header>
      <Card.Content>
        <dl className="grid gap-[var(--space-2)] sm:grid-cols-2">
          {getSupplierDetailData(supplier).map((field) => (
            <div
              className="flex min-w-0 flex-col gap-[var(--space-1)]"
              key={field.label}
            >
              <dt>
                <Typography color="text-secondary" variant="body2">
                  {field.label}
                </Typography>
              </dt>
              <dd className="min-w-0 break-words">
                <Typography variant="body1">{field.value || '-'}</Typography>
              </dd>
            </div>
          ))}
        </dl>
      </Card.Content>
    </Card.Root>
  );
};
