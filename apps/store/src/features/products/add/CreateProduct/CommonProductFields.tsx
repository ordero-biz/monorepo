import { Card, Typography } from '@ordero/ui';
import { CommonProductFieldInputs } from './CommonProductFieldInputs';
import type { CommonProductFieldsProps } from './types';

export const CommonProductFields = ({
  productVariantsCreationForm,
}: CommonProductFieldsProps) => (
  <Card.Root variant="filled">
    <Card.Content>
      <section aria-labelledby="common-product-heading">
        <Typography id="common-product-heading" variant="h5">
          Common product
        </Typography>
        <div className="mt-1">
          <CommonProductFieldInputs
            productVariantsCreationForm={productVariantsCreationForm}
          />
        </div>
      </section>
    </Card.Content>
  </Card.Root>
);
