'use client';

import { Button, Card, Typography } from '@ordero/ui';
import { useAttributeQuery } from '@/lib/hooks/useAttributeQuery';
import { useAttributeValuesQuery } from '@/lib/hooks/useAttributeValuesQuery';
import { formatDate } from '@/utils/formatDate';

type AttributeDetailProps = {
  attributeId: string;
};

export const AttributeDetail = ({ attributeId }: AttributeDetailProps) => {
  const attributeQuery = useAttributeQuery(attributeId);
  const attributeValuesQuery = useAttributeValuesQuery({
    attributeId,
    enabled: attributeQuery.isSuccess,
  });

  if (attributeQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading attribute...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (attributeQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load this attribute right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => attributeQuery.refetch()}
                size="s"
                type="button"
              >
                Retry
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    );
  }

  const attribute = attributeQuery.data;

  return (
    <div className="flex flex-col gap-[var(--space-2)] p-[var(--space-1-25)]">
      <Typography variant="h5">{`Attribute ${attribute.name}`}</Typography>
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <div className="flex flex-col gap-[var(--space-0-5)]">
              <Typography color="text-secondary" variant="body2">
                Created at
              </Typography>
              <Typography variant="body2">
                {formatDate(attribute.createdAt)}
              </Typography>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography color="text-secondary" variant="body2">
              Attribute values
            </Typography>
            {attributeValuesQuery.isPending ? (
              <Typography color="text-secondary" variant="body2">
                Loading attribute values...
              </Typography>
            ) : null}
            {attributeValuesQuery.isError ? (
              <div className="flex flex-col gap-[var(--space-2)]">
                <Typography variant="body2">
                  We couldn&apos;t load this attribute&apos;s values right now.
                </Typography>
                <div>
                  <Button
                    color="inherit"
                    onClick={() => attributeValuesQuery.refetch()}
                    size="s"
                    type="button"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            ) : null}
            {attributeValuesQuery.isSuccess ? (
              attributeValuesQuery.data.length ? (
                <ul className="flex flex-col">
                  {attributeValuesQuery.data.map((attributeValue) => (
                    <li
                      className="border-b border-dashed border-[var(--color-divider)] py-[var(--space-2)] last:border-b-0"
                      key={`${attributeValue.name}-${attributeValue.sortOrder}`}
                    >
                      <Typography variant="body2">
                        {attributeValue.name}
                      </Typography>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography color="text-secondary" variant="body2">
                  No attribute values found.
                </Typography>
              )
            ) : null}
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  );
};
