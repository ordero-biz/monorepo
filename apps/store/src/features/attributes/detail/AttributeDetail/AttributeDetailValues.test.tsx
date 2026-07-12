import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getAttributeValues } from '@/lib/client/api/attributes';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { AttributeDetailValues } from './AttributeDetailValues';

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  getAttributeValues: vi.fn(),
}));

const getAttributeValuesMock = vi.mocked(getAttributeValues);

const { setup } = prepareStoreSetup({
  component: AttributeDetailValues,
  props: {
    attributeId: '7',
  },
});

describe('AttributeDetailValues', () => {
  beforeEach(() => {
    getAttributeValuesMock.mockReset();
  });

  it('loads attribute values', async () => {
    getAttributeValuesMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading attribute values...')).toBeVisible();
    await waitFor(() =>
      expect(getAttributeValuesMock).toHaveBeenCalledWith('7')
    );
  });

  it('renders values in a one-column table', async () => {
    getAttributeValuesMock.mockResolvedValue({
      ok: true,
      data: [
        {
          id: 3,
          name: 'Blue',
          sortOrder: 0,
          createdAt: '2026-06-24T20:07:32.467Z',
        },
      ],
    });

    setup();

    expect(
      await screen.findByRole('table', { name: 'Attribute values' })
    ).toBeVisible();
    expect(screen.getByText('Name')).toBeVisible();
    expect(screen.getByText('Blue')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Edit Blue' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Delete Blue' })).toBeVisible();
    expect(
      screen.queryByRole('columnheader', { name: 'Created at' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('columnheader', { name: 'Sort order' })
    ).not.toBeInTheDocument();
  });

  it('opens the update dialog for the selected value', async () => {
    getAttributeValuesMock.mockResolvedValue({
      ok: true,
      data: [
        {
          id: 3,
          name: 'Blue',
          sortOrder: 0,
          createdAt: '2026-06-24T20:07:32.467Z',
        },
      ],
    });
    const user = userEvent.setup();

    setup();

    await user.click(await screen.findByRole('button', { name: 'Edit Blue' }));

    expect(
      screen.getByRole('dialog', { name: 'Edit Attribute Value' })
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Attribute value name' })
    ).toHaveValue('Blue');
  });

  it('opens the delete dialog for the selected value', async () => {
    getAttributeValuesMock.mockResolvedValue({
      ok: true,
      data: [
        {
          id: 3,
          name: 'Blue',
          sortOrder: 0,
          createdAt: '2026-06-24T20:07:32.467Z',
        },
      ],
    });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('button', { name: 'Delete Blue' })
    );

    const dialog = screen.getByRole('dialog', {
      name: 'Delete attribute value',
    });

    expect(dialog).toBeVisible();
    expect(within(dialog).getByText('Blue')).toBeVisible();
  });

  it('shows an error and retries loading attribute values', async () => {
    getAttributeValuesMock
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 500,
          message: 'Could not load attribute values.',
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: [
          {
            id: 3,
            name: 'Blue',
            sortOrder: 0,
            createdAt: '2026-06-24T20:07:32.467Z',
          },
        ],
      });
    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByText(
        "We couldn't load this attribute's values right now."
      )
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Blue')).toBeVisible();
    expect(getAttributeValuesMock).toHaveBeenCalledTimes(2);
  });
});
