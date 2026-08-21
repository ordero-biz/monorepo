import { Card, Typography } from '@ordero/ui';
import type { Category } from '@/lib/domain/categories/types';
import type { CategoryDetailField, CategoryDetailInfoProps } from './types';

const getCategoryDetailData = (category: Category): CategoryDetailField[] => [
  {
    label: 'Parent category',
    value: category.parentCategory?.name,
  },
];

export const CategoryDetailInfo = ({ category }: CategoryDetailInfoProps) => (
  <Card.Root variant="filled">
    <Card.Header>
      <Card.Title>Category details</Card.Title>
    </Card.Header>
    <Card.Content>
      <dl className="grid gap-[var(--space-2)] sm:grid-cols-2">
        {getCategoryDetailData(category).map((field) => (
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
