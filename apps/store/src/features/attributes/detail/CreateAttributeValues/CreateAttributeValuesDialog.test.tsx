import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAttributeValues } from '@/lib/client/api/attributes';
import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateAttributeValuesDialog } from './CreateAttributeValuesDialog';
import type { CreateAttributeValuesDialogProps } from './types';

const onOpenChangeMock = vi.fn();

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  createAttributeValues: vi.fn(),
}));

const createAttributeValuesMock = vi.mocked(createAttributeValues);

const { setup } = prepareStoreSetup<CreateAttributeValuesDialogProps>({
  component: CreateAttributeValuesDialog,
  props: {
    attributeId: 7,
    attributeStatus: ATTRIBUTE_STATUS.ACTIVE,
    onOpenChange: onOpenChangeMock,
    open: true,
  },
});

describe('CreateAttributeValuesDialog', () => {
  beforeEach(() => {
    createAttributeValuesMock.mockReset();
    onOpenChangeMock.mockClear();
  });

  it('requires at least one attribute value before it can be submitted', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', {
      name: 'Add attribute values',
    });
    const valueField = within(dialog).getByRole('textbox', {
      name: 'Attribute value 1',
    });
    const addAnotherValueButton = within(dialog).getByRole('button', {
      name: '+ Add another value',
    });
    const saveButton = within(dialog).getByRole('button', { name: 'Save' });

    expect(within(dialog).getByText('Attribute values')).toBeVisible();
    expect(
      within(dialog).queryByRole('button', {
        name: 'Remove attribute value 1',
      })
    ).not.toBeInTheDocument();
    expect(saveButton).toBeDisabled();
    expect(addAnotherValueButton).toBeDisabled();

    await user.type(valueField, 'Green');

    expect(saveButton).toBeEnabled();
    expect(addAnotherValueButton).toBeEnabled();
  });

  it('does not validate an empty value on blur', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', {
      name: 'Add attribute values',
    });
    const valueField = within(dialog).getByRole('textbox', {
      name: 'Attribute value 1',
    });

    await user.click(valueField);
    await user.tab();

    expect(
      within(dialog).queryByText(
        'Enter an attribute value or remove this empty field'
      )
    ).not.toBeInTheDocument();
  });

  it('adds values and refreshes the attribute values query', async () => {
    createAttributeValuesMock.mockResolvedValue({
      ok: true,
      data: [
        {
          id: 3,
          name: 'Green',
          sortOrder: 0,
          createdAt: '2026-07-18T07:53:03.586Z',
        },
      ],
    });
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const dialog = screen.getByRole('dialog', {
      name: 'Add attribute values',
    });
    const valueField = within(dialog).getByRole('textbox', {
      name: 'Attribute value 1',
    });

    await user.type(valueField, '  Green  ');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(createAttributeValuesMock).toHaveBeenCalledWith({
      attributeId: 7,
      attributeValues: [
        {
          name: 'Green',
          sortOrder: 0,
          status: ATTRIBUTE_STATUS.DRAFT,
        },
      ],
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: attributesQueryKeys.values(7),
      })
    );
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  it('allows active values when the attribute is active', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', {
      name: 'Add attribute values',
    });
    const valueStatus = within(dialog).getByRole('combobox', {
      name: 'Attribute value status 1',
    });

    expect(valueStatus).toBeEnabled();
    expect(valueStatus).toBeRequired();
    expect(
      within(dialog).queryByText(
        'Attribute values cannot be active while the attribute is a draft'
      )
    ).not.toBeInTheDocument();

    await user.click(valueStatus);
    await user.click(await screen.findByRole('option', { name: 'Active' }));

    expect(valueStatus).toHaveTextContent('Active');
  });

  it('prevents active values when the attribute is a draft', () => {
    setup({
      attributeStatus: ATTRIBUTE_STATUS.DRAFT,
    });

    const dialog = screen.getByRole('dialog', {
      name: 'Add attribute values',
    });

    expect(
      within(dialog).getByRole('combobox', {
        name: 'Attribute value status 1',
      })
    ).toBeDisabled();
    expect(
      within(dialog).getByText(
        'Attribute values cannot be active while the attribute is a draft'
      )
    ).toBeVisible();
  });

  it('removes an added value row without clearing the remaining value', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', {
      name: 'Add attribute values',
    });
    const firstValueField = within(dialog).getByRole('textbox', {
      name: 'Attribute value 1',
    });

    await user.type(firstValueField, 'Green');
    await user.click(
      within(dialog).getByRole('button', { name: '+ Add another value' })
    );
    const secondValueField = within(dialog).getByRole('textbox', {
      name: 'Attribute value 2',
    });
    const nextAddAnotherValueButton = within(dialog).getByRole('button', {
      name: '+ Add another value',
    });

    await waitFor(() => expect(secondValueField).toHaveFocus());
    expect(nextAddAnotherValueButton).toBeDisabled();

    await user.type(secondValueField, 'Blue');
    await user.click(
      within(dialog).getByRole('button', { name: 'Remove attribute value 1' })
    );

    expect(
      within(dialog).getByRole('textbox', { name: 'Attribute value 1' })
    ).toHaveValue('Blue');
    expect(
      within(dialog).queryByRole('textbox', { name: 'Attribute value 2' })
    ).not.toBeInTheDocument();
  });

  it('shows a required error beside an empty added value after submit', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', {
      name: 'Add attribute values',
    });

    await user.type(
      within(dialog).getByRole('textbox', { name: 'Attribute value 1' }),
      'Green'
    );
    await user.click(
      within(dialog).getByRole('button', { name: '+ Add another value' })
    );
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(
      await within(dialog).findAllByText(
        'Enter an attribute value or remove this empty field'
      )
    ).toHaveLength(1);
    expect(
      within(dialog).getByRole('textbox', { name: 'Attribute value 2' })
    ).toHaveAccessibleDescription(
      'Enter an attribute value or remove this empty field'
    );
    expect(createAttributeValuesMock).not.toHaveBeenCalled();
  });

  it('prevents value edits while the request is in flight', async () => {
    let resolveCreate:
      | ((value: Awaited<ReturnType<typeof createAttributeValues>>) => void)
      | undefined;

    createAttributeValuesMock.mockReturnValue(
      new Promise((resolve) => {
        resolveCreate = resolve;
      })
    );
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', {
      name: 'Add attribute values',
    });
    const valueField = within(dialog).getByRole('textbox', {
      name: 'Attribute value 1',
    });

    await user.type(valueField, 'Green');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(createAttributeValuesMock).toHaveBeenCalledTimes(1);
    expect(
      within(dialog).getByRole('button', { name: 'Saving...' })
    ).toBeDisabled();
    expect(valueField).toBeDisabled();
    expect(
      within(dialog).getByRole('button', { name: '+ Add another value' })
    ).toBeDisabled();
    expect(
      within(dialog).getByRole('button', { name: 'Close' })
    ).toBeDisabled();

    resolveCreate?.({
      ok: true,
      data: [
        {
          id: 3,
          name: 'Green',
          sortOrder: 0,
          createdAt: '2026-07-18T07:53:03.586Z',
        },
      ],
    });

    await within(dialog).findByRole('button', { name: 'Save' });
    expect(createAttributeValuesMock).toHaveBeenCalledTimes(1);
  });

  it('shows a backend name error beside the matching value field', async () => {
    createAttributeValuesMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Attribute values could not be added.',
        fieldErrors: {
          'attributeValues[0].name': 'Attribute value already exists.',
        },
      },
    });
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', {
      name: 'Add attribute values',
    });
    const valueField = within(dialog).getByRole('textbox', {
      name: 'Attribute value 1',
    });

    await user.type(valueField, 'Green');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(
      await within(dialog).findByText('Attribute value already exists.')
    ).toBeVisible();
    expect(valueField).toHaveAccessibleDescription(
      'Attribute value already exists.'
    );
    expect(onOpenChangeMock).not.toHaveBeenCalledWith(false);
  });
});
