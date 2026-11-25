import { Button, Dialog } from '@ordero/ui';
import { CreateAttributeValuesFields } from './CreateAttributeValuesFields';
import type { CreateAttributeValuesDialogFormContentProps } from './types';

export const CreateAttributeValuesDialogFormContent = ({
  attributeStatus,
  form,
  open,
}: CreateAttributeValuesDialogFormContentProps) => {
  return (
    <>
      <Dialog.Content>
        <div className="flex flex-col gap-[var(--space-2)]">
          <CreateAttributeValuesFields
            attributeStatus={attributeStatus}
            form={form}
            open={open}
          />
        </div>
      </Dialog.Content>

      <form.Subscribe
        selector={(state) =>
          [state.values.attributeValues, state.isSubmitting] as const
        }
      >
        {([attributeValues, isSubmitting]) => {
          const hasAttributeValue = attributeValues.some((attributeValue) =>
            attributeValue.value.trim()
          );

          return (
            <Dialog.Footer closeDisabled={isSubmitting}>
              <Button
                disabled={isSubmitting || !hasAttributeValue}
                type="submit"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </Dialog.Footer>
          );
        }}
      </form.Subscribe>
    </>
  );
};
