'use client';

import { Button, Dialog, Radio, RadioGroup } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { useId } from 'react';
import type { FormMergeChoices } from '@/lib/utils/form/comparison/mergeFormValues';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import type {
  FormConflictDialogProps,
  FormConflictFormProps,
  FormConflictFormValues,
} from './types';
import { validateConflictChoice } from './validations';

const FormConflictForm = <TField extends string>({
  conflicts,
  updates,
  saveNotice = 'This action does not save your edits.',
  onApply,
}: FormConflictFormProps<TField>) => {
  const saveNoticeId = useId();
  const hasConflicts = conflicts.length > 0;
  const hasUpdates = updates.length > 0;
  const hasReviewItems = hasConflicts || hasUpdates;
  let description =
    'There are no field updates to review. You can use the latest saved version while keeping your edits.';
  if (hasConflicts) {
    description = hasUpdates
      ? 'Review the saved updates below, then choose which values to keep where both versions changed.'
      : 'Some details changed both on your page and in the saved version. Choose which values to keep. Your other edits will be kept.';
  } else if (hasUpdates) {
    description =
      'Review the saved updates below. Your unsaved edits will be kept.';
  }
  const defaultValues: FormConflictFormValues = {
    choices: conflicts.map(() => undefined),
  };
  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => {
      const choices: FormMergeChoices<TField> = {};
      conflicts.forEach(({ field }, index) => {
        choices[field] = value.choices[index];
      });
      onApply(choices);
    },
  });

  return (
    <form
      aria-label="Review form updates"
      className="flex min-h-0 flex-col"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <Dialog.Header>
        <Dialog.Title>
          {hasReviewItems ? 'Review updates' : 'No updates to review'}
        </Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
      </Dialog.Header>
      {hasReviewItems && (
        <Dialog.Content scrollable>
          <div className="flex flex-col gap-[var(--space-2)]">
            {updates.length > 0 && (
              <section aria-label="Updates to apply">
                <h3 className="font-[var(--subtitle2-weight)]">
                  Updates to apply
                </h3>
                <dl className="mt-[var(--space-1)] flex flex-col gap-[var(--space-2)]">
                  {updates.map((update) => (
                    <div key={update.field}>
                      <dt className="font-[var(--subtitle2-weight)]">
                        {update.label}
                      </dt>
                      <dd className="mt-[var(--space-1)] grid gap-[var(--space-1)]">
                        <div>
                          <p className="text-muted-foreground">Current value</p>
                          <p className="whitespace-pre-wrap wrap-break-word">
                            {update.currentValue}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            After applying
                          </p>
                          <p className="whitespace-pre-wrap wrap-break-word">
                            {update.mergedValue}
                          </p>
                        </div>
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
            {conflicts.length > 0 && (
              <h3 className="font-[var(--subtitle2-weight)]">
                Choose which values to keep
              </h3>
            )}
            {conflicts.map((conflict, index) => (
              <form.Field
                key={conflict.field}
                name={`choices[${index}]`}
                validators={{
                  onChange: validateConflictChoice,
                  onSubmit: validateConflictChoice,
                }}
              >
                {(field) => {
                  const errorText = getFieldSubmitChangeErrorText(
                    field.state.meta
                  );

                  return (
                    <RadioGroup
                      errorText={errorText}
                      helperText={conflict.helperText}
                      invalid={Boolean(errorText)}
                      label={conflict.label}
                      name={field.name}
                      onValueChange={(value) => {
                        if (value === 'local' || value === 'server') {
                          field.handleChange(value);
                        }
                      }}
                      required
                      value={field.state.value ?? ''}
                    >
                      <Radio
                        align="start"
                        onBlur={field.handleBlur}
                        value="local"
                      >
                        <div className="whitespace-pre-wrap">
                          Keep my changes:
                        </div>
                        <div className="whitespace-pre-wrap">
                          {conflict.localValue}
                        </div>
                      </Radio>
                      <Radio
                        align="start"
                        onBlur={field.handleBlur}
                        value="server"
                      >
                        <div className="whitespace-pre-wrap">
                          Use saved value:
                        </div>
                        <div className="whitespace-pre-wrap">
                          {conflict.serverValue}
                        </div>
                      </Radio>
                    </RadioGroup>
                  );
                }}
              </form.Field>
            ))}
          </div>
        </Dialog.Content>
      )}
      <p
        className="mt-[var(--space-2)] text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] text-muted-foreground"
        id={saveNoticeId}
      >
        {saveNotice}
      </p>
      <Dialog.Footer closeButtonLabel="Cancel">
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              aria-describedby={saveNoticeId}
              disabled={isSubmitting}
              type="submit"
            >
              {hasReviewItems ? 'Apply changes' : 'Use latest version'}
            </Button>
          )}
        </form.Subscribe>
      </Dialog.Footer>
    </form>
  );
};

export const FormConflictDialog = <TField extends string>({
  revision,
  conflicts,
  updates,
  saveNotice,
  onApply,
  onClose,
}: FormConflictDialogProps<TField>) => (
  <Dialog.Root onOpenChange={(open) => !open && onClose()} open>
    <Dialog.Portal>
      <Dialog.Backdrop />
      <Dialog.Viewport>
        <Dialog.Popup size="md">
          {/* A new saved revision requires fresh choices and validation. */}
          <FormConflictForm
            conflicts={conflicts}
            updates={updates}
            saveNotice={saveNotice}
            key={revision}
            onApply={onApply}
          />
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  </Dialog.Root>
);
