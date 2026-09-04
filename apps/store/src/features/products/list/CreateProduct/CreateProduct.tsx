'use client';

import {
  Accordion,
  Button,
  ContextualActionBar,
  PageHeader,
  Typography,
} from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { BaseLayoutContextualActionBar } from '@/features/app-shell';
import { clientRoutes } from '@/lib/client/routes';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { PRODUCT_CREATION_MODE } from '@/lib/domain/products/constants';
import {
  productGroupsQueryKeys,
  productVariantsQueryKeys,
} from '@/lib/query/products/productsQueryKeys';
import { PRODUCT_GENERATION_MODE } from './constants';
import { GeneratedProductVariants } from './GeneratedProductVariants';
import { GenerateProductActions } from './GenerateProductActions';
import { useCreateProductForm } from './hooks/useCreateProductForm';
import { ProductAttributeValuesField } from './ProductAttributeValuesField';
import type { CreateProductProps, ProductVariantsGeneratedArgs } from './types';

export const CreateProduct = ({
  creationMode,
  TemplateFields,
  validateProduct,
}: CreateProductProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const generationMode =
    creationMode === PRODUCT_CREATION_MODE.multiple
      ? PRODUCT_GENERATION_MODE.many
      : PRODUCT_GENERATION_MODE.one;
  const [generatedAttributes, setGeneratedAttributes] = useState<
    AttributeDropdown[]
  >([]);
  const [generatedTemplateSignature, setGeneratedTemplateSignature] =
    useState<string>();
  const [generationVersion, setGenerationVersion] = useState(0);
  const { form } = useCreateProductForm({
    onCreated: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: productGroupsQueryKeys.list,
        }),
        queryClient.invalidateQueries({
          queryKey: productVariantsQueryKeys.list,
        }),
      ]);
      router.push(clientRoutes.products);
    },
  });
  const handleProductVariantsGenerated = useCallback(
    ({ attributes, generationSignature }: ProductVariantsGeneratedArgs) => {
      setGeneratedAttributes(attributes);
      setGeneratedTemplateSignature(generationSignature);
      setGenerationVersion((currentVersion) => currentVersion + 1);
    },
    []
  );
  const handleCreateProduct = () => {
    const validationResult = validateProduct(form.state.values);

    form.setErrorMap({
      onSubmit: validationResult,
    });

    if (validationResult) {
      void form.handleSubmit();
      return;
    }

    void form.handleSubmit();
  };

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        handleCreateProduct();
      }}
    >
      <PageHeader.Root>
        <PageHeader.Left>
          <Typography variant="h5">Create product</Typography>
        </PageHeader.Left>
        <PageHeader.Right></PageHeader.Right>
      </PageHeader.Root>

      <Accordion.Root
        aria-label="Product template"
        defaultValue={['product-template']}
      >
        <Accordion.Item value="product-template">
          <Accordion.Header>
            <Accordion.Trigger>Product template</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <div className="flex flex-col gap-[var(--space-2)]">
              <TemplateFields form={form} />

              <ProductAttributeValuesField form={form} />

              <GenerateProductActions
                form={form}
                generatedTemplateSignature={generatedTemplateSignature}
                generationMode={generationMode}
                onProductVariantsGenerated={handleProductVariantsGenerated}
              />
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>

      <GeneratedProductVariants
        form={form}
        generatedAttributes={generatedAttributes}
        generationMode={generationMode}
        generationVersion={generationVersion}
      />
      <form.Subscribe selector={(state) => state.values.productVariants.length}>
        {(productVariantCount) =>
          productVariantCount > 0 ? (
            <>
              <div aria-hidden="true" className="h-[var(--space-12)]" />
              <BaseLayoutContextualActionBar>
                <ContextualActionBar.Root ariaLabel="Product creation actions">
                  <ContextualActionBar.Left>
                    <Typography variant="body2">
                      {productVariantCount === 1
                        ? '1 product variant ready'
                        : `${productVariantCount} product variants ready`}
                    </Typography>
                  </ContextualActionBar.Left>
                  <ContextualActionBar.Right>
                    <form.Subscribe selector={(state) => state.isSubmitting}>
                      {(isSubmitting) => (
                        <Button
                          color="primary"
                          disabled={isSubmitting}
                          size="l"
                          onClick={handleCreateProduct}
                          type="button"
                        >
                          {isSubmitting
                            ? 'Creating product...'
                            : 'Create product'}
                        </Button>
                      )}
                    </form.Subscribe>
                  </ContextualActionBar.Right>
                </ContextualActionBar.Root>
              </BaseLayoutContextualActionBar>
            </>
          ) : null
        }
      </form.Subscribe>
    </form>
  );
};
