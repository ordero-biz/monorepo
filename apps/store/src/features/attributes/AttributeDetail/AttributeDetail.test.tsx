import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getAttribute,
  getAttributeValues,
  updateAttribute,
} from '@/lib/client/api/attributes';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { AttributeDetail } from './AttributeDetail';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  getAttribute: vi.fn(),
  getAttributeValues: vi.fn(),
  updateAttribute: vi.fn(),
}));

const getAttributeMock = vi.mocked(getAttribute);
const getAttributeValuesMock = vi.mocked(getAttributeValues);
const updateAttributeMock = vi.mocked(updateAttribute);

const { setup } = prepareStoreSetup({
  component: AttributeDetail,
  props: {
    attributeId: '7',
  },
});

describe('AttributeDetail', () => {
  beforeEach(() => {
    getAttributeMock.mockReset();
    getAttributeValuesMock.mockReset();
    updateAttributeMock.mockReset();
  });

  it('requests the attribute and its values when loaded', async () => {
    getAttributeMock.mockReturnValue(new Promise(() => {}));
    getAttributeValuesMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading Attribute...')).toBeVisible();

    await waitFor(() => {
      expect(getAttributeMock).toHaveBeenCalledWith('7');
      expect(getAttributeValuesMock).toHaveBeenCalledWith('7');
    });
  });

  it('renders the attribute name as the page title and values in a one-column table', async () => {
    getAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        id: 7,
        name: 'Color',
        sortOrder: 10,
        createdAt: '2026-06-24T20:07:32.467Z',
      },
    });
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

    expect(await screen.findByRole('heading', { name: 'Color' })).toBeVisible();
    expect(
      await screen.findByRole('table', { name: 'Attribute values' })
    ).toBeVisible();
    expect(screen.getByText('Name')).toBeVisible();
    expect(screen.getByText('Blue')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Update Blue' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Delete Blue' })).toBeVisible();
    expect(
      screen.queryByRole('columnheader', { name: 'Created at' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('columnheader', { name: 'Sort order' })
    ).not.toBeInTheDocument();
  });

  it('opens one attribute value update dialog from a row action', async () => {
    getAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        id: 7,
        name: 'Color',
        sortOrder: 10,
        createdAt: '2026-06-24T20:07:32.467Z',
      },
    });
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
      await screen.findByRole('button', { name: 'Update Blue' })
    );

    expect(
      screen.getByRole('dialog', { name: 'Edit Attribute Value' })
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Attribute value name' })
    ).toHaveValue('Blue');
  });

  it('opens one attribute value delete dialog from a row action', async () => {
    getAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        id: 7,
        name: 'Color',
        sortOrder: 10,
        createdAt: '2026-06-24T20:07:32.467Z',
      },
    });
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

  it('refetches the attribute detail after updating the attribute name', async () => {
    getAttributeMock
      .mockResolvedValueOnce({
        ok: true,
        data: {
          id: 7,
          name: 'Color',
          sortOrder: 10,
          createdAt: '2026-06-24T20:07:32.467Z',
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          id: 7,
          name: 'Material',
          sortOrder: 10,
          createdAt: '2026-06-25T18:13:29.608Z',
        },
      });
    getAttributeValuesMock.mockResolvedValue({
      ok: true,
      data: [],
    });
    updateAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        id: 7,
        name: 'Material',
        sortOrder: 10,
        createdAt: '2026-06-25T18:13:29.608Z',
      },
    });
    const user = userEvent.setup();

    setup();

    expect(await screen.findByRole('heading', { name: 'Color' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Edit Attribute' }));

    const nameField = screen.getByRole('textbox', {
      name: 'Attribute name',
    });

    await user.clear(nameField);
    await user.type(nameField, 'Material');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(updateAttributeMock).toHaveBeenCalledWith({
      attributeId: 7,
      name: 'Material',
    });
    expect(
      await screen.findByRole('heading', { name: 'Material' })
    ).toBeVisible();
    expect(getAttributeMock).toHaveBeenCalledTimes(2);
  });

  it('renders an attribute error state and retries loading the attribute', async () => {
    getAttributeMock
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 500,
          message: 'Could not load attribute.',
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          id: 7,
          name: 'Color',
          sortOrder: 10,
          createdAt: '2026-06-24T20:07:32.467Z',
        },
      });
    getAttributeValuesMock.mockResolvedValue({
      ok: true,
      data: [],
    });

    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByText("We couldn't load this attribute right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByRole('heading', { name: 'Color' })).toBeVisible();
    expect(getAttributeMock).toHaveBeenCalledTimes(2);
  });

  it('renders a values error state and retries loading the values', async () => {
    getAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        id: 7,
        name: 'Color',
        sortOrder: 10,
        createdAt: '2026-06-24T20:07:32.467Z',
      },
    });
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
