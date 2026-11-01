import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mergeFormValues } from '@/lib/utils/form/comparison/mergeFormValues';
import { prepareStoreSetup } from '@/test/prepareSetup';
import {
  type FormConflictPolicy,
  FormConflictResolver,
  type FormConflictResolverProviderProps,
} from './index';

type Values = { title: string };
type SavedRecord = { version: number; locked: boolean; values: Values };

const initial: SavedRecord = {
  version: 1,
  locked: false,
  values: { title: 'Original' },
};
const latest: SavedRecord = {
  ...initial,
  version: 2,
  values: { title: 'Saved title' },
};
const policy: FormConflictPolicy<SavedRecord, Values> = {
  getVersion: (record) => record.version,
  getDefaultValues: (record) => record.values,
  merge: ({ baseline, current, latest, choices }) =>
    mergeFormValues({
      baseline: baseline.values,
      current,
      latest: latest.values,
      choices,
      fields: { title: { label: 'Title', describe: String } },
    }),
  notice: {
    title: 'Record changed',
    description: 'Review the latest saved record while keeping your edits.',
  },
  readOnly: {
    isReadOnly: (record) => record.locked,
    notice: {
      title: 'Record locked',
      description: 'The saved record can no longer be edited.',
    },
  },
};

const EditorActions = () => {
  const resolver = FormConflictResolver.useContext();

  return (
    <>
      <input aria-label="Draft notes" defaultValue="" />
      <FormConflictResolver.ReviewButton />
      <button disabled={resolver?.isReadOnly ?? false} type="button">
        Save
      </button>
    </>
  );
};

const defaultProps: FormConflictResolverProviderProps<SavedRecord, Values> = {
  baseline: initial,
  latest: initial,
  policy,
  onBaselineChange: vi.fn(),
  form: {
    isPristine: false,
    isSubmitting: false,
    getValues: () => ({ title: 'My title' }),
    reset: vi.fn(),
    setFieldValue: vi.fn(),
  },
  children: <EditorActions />,
};
const { setup } = prepareStoreSetup({
  component: FormConflictResolver.Provider<SavedRecord, Values>,
  props: defaultProps,
});
const { setup: setupWithoutResolver } = prepareStoreSetup({
  component: EditorActions,
});

describe('FormConflictResolver', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders typed field previews with the latest saved values before applying', async () => {
    const user = userEvent.setup();
    const {
      form,
      renderResult: { rerender },
    } = setup({
      latest,
      form: { ...defaultProps.form, getValues: () => initial.values },
      policy: {
        ...policy,
        fieldRenderers: {
          title: {
            renderUpdate: ({ baseline, current, latest, merged }) => (
              <p>{`Original: ${baseline}; on page: ${current}; saved: ${latest}; result: ${merged}`}</p>
            ),
          },
        },
      } satisfies FormConflictPolicy<SavedRecord, Values>,
    });
    await user.click(screen.getByRole('button', { name: 'Review updates' }));
    expect(
      screen.getByText(
        'Original: Original; on page: Original; saved: Saved title; result: Saved title'
      )
    ).toBeVisible();
    expect(screen.queryByText('Current value')).not.toBeInTheDocument();
    rerender({
      latest: { ...latest, version: 3, values: { title: 'New saved title' } },
    });
    expect(
      screen.getByText(
        'Original: Original; on page: Original; saved: New saved title; result: New saved title'
      )
    ).toBeVisible();
    expect(form.reset).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    expect(form.reset).toHaveBeenCalledExactlyOnceWith({
      title: 'New saved title',
    });
  });

  it('validates custom conflict choices and applies the selected typed value', async () => {
    const user = userEvent.setup();
    const { form } = setup({
      latest,
      policy: {
        ...policy,
        fieldRenderers: {
          title: {
            renderChoice: ({ value, otherValue, choice }) => ({
              label: choice === 'local' ? 'Your title' : 'Saved title',
              content: (
                <>
                  <p>{value}</p>
                  <p>Compared with: {otherValue}</p>
                </>
              ),
            }),
          },
        },
      } satisfies FormConflictPolicy<SavedRecord, Values>,
    });
    await user.click(screen.getByRole('button', { name: 'Review updates' }));
    expect(screen.getByText('My title')).toBeVisible();
    expect(screen.getByText('Compared with: Saved title')).toBeVisible();
    expect(screen.getByText('Compared with: My title')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    expect(
      screen.getByRole('radiogroup', { name: 'Title' })
    ).toHaveAccessibleDescription('Choose which value to keep.');
    expect(form.reset).not.toHaveBeenCalled();
    await user.click(screen.getByRole('radio', { name: 'Your title' }));
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    expect(form.setFieldValue).toHaveBeenCalledExactlyOnceWith(
      'title',
      'My title'
    );
  });

  it('allows shared create-form actions without a provider', () => {
    setupWithoutResolver();

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
    expect(
      screen.queryByRole('button', { name: 'Review updates' })
    ).not.toBeInTheDocument();
  });

  it('opens its dialogs from a descendant review button and applies explicit choices', async () => {
    const user = userEvent.setup();
    const {
      form,
      onBaselineChange,
      policy: configuredPolicy,
      renderResult: { rerender },
    } = setup({
      policy: {
        ...policy,
        saveNotice: 'This action does not publish the record.',
      },
    });
    await user.type(
      screen.getByRole('textbox', { name: 'Draft notes' }),
      'Keep me'
    );
    expect(
      screen.queryByRole('button', { name: 'Review updates' })
    ).not.toBeInTheDocument();

    rerender({ latest });
    await user.click(screen.getByRole('button', { name: 'Keep editing' }));
    await user.click(screen.getByRole('button', { name: 'Review updates' }));
    expect(
      screen.queryByRole('dialog', { name: 'Record changed' })
    ).not.toBeInTheDocument();
    expect(form.reset).not.toHaveBeenCalled();
    expect(onBaselineChange).not.toHaveBeenCalled();
    expect(
      screen.getByRole('dialog', { name: 'Review updates' })
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Apply changes' })
    ).toHaveAccessibleDescription(configuredPolicy.saveNotice);
    await user.click(
      screen.getByRole('radio', { name: 'Keep my changes: My title' })
    );
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));

    expect(onBaselineChange).toHaveBeenCalledExactlyOnceWith(latest);
    expect(form.reset).toHaveBeenCalledExactlyOnceWith(latest.values);
    expect(form.setFieldValue).toHaveBeenCalledExactlyOnceWith(
      'title',
      'My title'
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Draft notes' })).toHaveValue(
      'Keep me'
    );
  });

  it.each([
    false,
    true,
  ])('closes an obsolete review after an external baseline update without remounting the editor (locked: %s)', async (locked) => {
    const user = userEvent.setup();
    const {
      form,
      renderResult: { rerender },
    } = setup({});
    await user.type(
      screen.getByRole('textbox', { name: 'Draft notes' }),
      'Still editing'
    );
    const accepted = { ...latest, locked };
    rerender({ latest: accepted });
    if (!locked) {
      await user.click(
        within(
          screen.getByRole('dialog', { name: 'Record changed' })
        ).getByRole('button', { name: 'Review updates' })
      );
    }
    expect(
      screen.getByRole('dialog', {
        name: locked ? 'Record locked' : 'Review updates',
      })
    ).toBeVisible();

    rerender({ baseline: accepted });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Review updates' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Draft notes' })).toHaveValue(
      'Still editing'
    );
    expect(form.reset).not.toHaveBeenCalled();
  });

  it('shows a dismissible read-only notice while preserving the draft and blocking save actions', async () => {
    const user = userEvent.setup();
    const {
      form,
      onBaselineChange,
      renderResult: { rerender },
    } = setup({});
    await user.type(
      screen.getByRole('textbox', { name: 'Draft notes' }),
      'Unsaved notes'
    );
    rerender({ latest: { ...latest, locked: true } });
    const notice = screen.getByRole('dialog', { name: 'Record locked' });
    expect(notice).toHaveAccessibleDescription(
      'The saved record can no longer be edited.'
    );
    expect(within(notice).getAllByRole('button')).toHaveLength(1);
    await user.click(within(notice).getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Draft notes' })).toHaveValue(
      'Unsaved notes'
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(form.reset).not.toHaveBeenCalled();
    expect(onBaselineChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Review updates' }));
    expect(screen.getByRole('dialog', { name: 'Record locked' })).toBeVisible();
  });

  it('replaces open conflict choices with the read-only notice when the record locks', async () => {
    const user = userEvent.setup();
    const {
      form,
      onBaselineChange,
      renderResult: { rerender },
    } = setup({ latest });
    await user.click(
      within(screen.getByRole('dialog', { name: 'Record changed' })).getByRole(
        'button',
        { name: 'Review updates' }
      )
    );
    await user.click(
      screen.getByRole('radio', { name: 'Keep my changes: My title' })
    );

    rerender({ latest: { ...latest, version: 3, locked: true } });
    expect(
      screen.queryByRole('dialog', { name: 'Review updates' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Record locked' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(form.reset).not.toHaveBeenCalled();
    expect(onBaselineChange).not.toHaveBeenCalled();
  });

  it('scopes read-only and pending-change state to the nearest provider', async () => {
    const user = userEvent.setup();
    const {
      renderResult: { rerender },
    } = setup({
      children: (
        <>
          <section aria-label="First editor">
            <EditorActions />
          </section>
          <FormConflictResolver.Provider {...defaultProps}>
            <section aria-label="Second editor">
              <EditorActions />
            </section>
          </FormConflictResolver.Provider>
        </>
      ),
    });
    rerender({ latest: { ...latest, locked: true } });
    await user.click(screen.getByRole('button', { name: 'Close' }));

    const first = within(screen.getByRole('region', { name: 'First editor' }));
    const second = within(
      screen.getByRole('region', { name: 'Second editor' })
    );
    expect(first.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(first.getByRole('button', { name: 'Review updates' })).toBeVisible();
    expect(second.getByRole('button', { name: 'Save' })).toBeEnabled();
    expect(
      second.queryByRole('button', { name: 'Review updates' })
    ).not.toBeInTheDocument();
  });
});
