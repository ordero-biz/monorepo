import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAttributeValues } from '@/lib/client/api/attributes';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateAttributeValuesDialog } from './CreateAttributeValuesDialog';

const onOpenChangeMock = vi.fn();

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  createAttributeValues: vi.fn(),
}));

const createAttributeValuesMock = vi.mocked(createAttributeValues);

const { setup } = prepareStoreSetup({
  component: CreateAttributeValuesDialog,
  props: {
    attributeId: 7,
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
    const addButton = within(dialog).getByRole('button', { name: 'Add' });

    expect(addButton).toBeDisabled();

    await user.type(valueField, 'Green');

    expect(addButton).toBeEnabled();
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
    await user.click(
      within(dialog).getByRole('button', { name: 'Add attribute value' })
    );
    await user.click(within(dialog).getByRole('button', { name: 'Add' }));

    expect(createAttributeValuesMock).toHaveBeenCalledWith({
      attributeId: 7,
      attributeValues: [
        {
          name: 'Green',
          sortOrder: 0,
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
      within(dialog).getByRole('button', { name: 'Add attribute value' })
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Attribute value 2' }),
      'Blue'
    );
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

  it('prevents another add while the request is in flight', async () => {
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
    await user.click(within(dialog).getByRole('button', { name: 'Add' }));

    expect(createAttributeValuesMock).toHaveBeenCalledTimes(1);
    expect(
      within(dialog).getByRole('button', { name: 'Adding...' })
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

    await within(dialog).findByRole('button', { name: 'Add' });
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
    await user.click(within(dialog).getByRole('button', { name: 'Add' }));

    expect(
      await within(dialog).findByText('Attribute value already exists.')
    ).toBeVisible();
    expect(valueField).toHaveAccessibleDescription(
      'Attribute value already exists.'
    );
    expect(onOpenChangeMock).not.toHaveBeenCalledWith(false);
  });
});
