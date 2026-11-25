import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getAttribute,
  getAttributeValues,
  updateAttributeValue,
} from '@/lib/client/api/attributes';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { AttributeDetailValues } from './AttributeDetailValues';

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  getAttribute: vi.fn(),
  getAttributeValues: vi.fn(),
  updateAttributeValue: vi.fn(),
}));

const getAttributeMock = vi.mocked(getAttribute);
const getAttributeValuesMock = vi.mocked(getAttributeValues);
const updateAttributeValueMock = vi.mocked(updateAttributeValue);

const { setup } = prepareStoreSetup({
  component: AttributeDetailValues,
  props: {
    attributeId: '7',
  },
});

describe('AttributeDetailValues', () => {
  beforeEach(() => {
    getAttributeMock.mockReset();
    getAttributeValuesMock.mockReset();
    updateAttributeValueMock.mockReset();
    getAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        id: 7,
        name: 'Color',
        sortOrder: 10,
        status: 'ACTIVE',
        createdAt: '2026-06-24T20:07:32.467Z',
      },
    });
  });

  it('loads attribute values', async () => {
    getAttributeValuesMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading attribute values...')).toBeVisible();
    await waitFor(() =>
      expect(getAttributeValuesMock).toHaveBeenCalledWith('7')
    );
  });

  it('renders values with an actions menu', async () => {
    getAttributeValuesMock.mockResolvedValue({
      ok: true,
      data: [
        {
          id: 3,
          name: 'Blue',
          sortOrder: 0,
          status: 'ACTIVE',
          createdAt: '2026-06-24T20:07:32.467Z',
        },
        {
          id: 4,
          name: 'Green',
          sortOrder: 1,
          status: 'DRAFT',
          createdAt: '2026-06-24T20:07:32.467Z',
        },
      ],
    });

    setup();

    expect(
      await screen.findByRole('table', { name: 'Attribute values' })
    ).toBeVisible();
    expect(screen.getByText('Name')).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    expect(screen.getByText('Blue')).toBeVisible();
    expect(screen.getByText('Active')).toBeVisible();
    expect(screen.getByText('Draft')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Actions for Blue' })
    ).toBeVisible();
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
          status: 'DRAFT',
          createdAt: '2026-06-24T20:07:32.467Z',
        },
      ],
    });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('button', { name: 'Actions for Blue' })
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Edit' }));

    expect(
      screen.getByRole('dialog', { name: 'Edit Attribute Value' })
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Attribute value name' })
    ).toHaveValue('Blue');
  });

  it('refreshes the attribute values once after publishing', async () => {
    const draftValue = {
      id: 3,
      name: 'Blue',
      sortOrder: 0,
      status: 'DRAFT' as const,
      createdAt: '2026-06-24T20:07:32.467Z',
    };
    const activeValue = { ...draftValue, status: 'ACTIVE' as const };
    getAttributeValuesMock
      .mockResolvedValueOnce({ ok: true, data: [draftValue] })
      .mockResolvedValue({ ok: true, data: [activeValue] });
    updateAttributeValueMock.mockResolvedValue({
      ok: true,
      data: activeValue,
    });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('button', { name: 'Actions for Blue' })
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Publish' }));

    expect(
      screen.getByRole('dialog', { name: 'Publish attribute value' })
    ).toBeVisible();

    await user.click(
      within(
        screen.getByRole('dialog', { name: 'Publish attribute value' })
      ).getByRole('button', { name: 'Publish' })
    );

    expect(await screen.findByText('Active')).toBeVisible();
    expect(
      screen.queryByRole('dialog', { name: 'Publish attribute value' })
    ).not.toBeInTheDocument();
    expect(updateAttributeValueMock).toHaveBeenCalledExactlyOnceWith({
      attributeValueId: 3,
      status: 'ACTIVE',
    });
    expect(getAttributeValuesMock).toHaveBeenCalledTimes(2);
  });

  it('hides the edit action for active attribute values', async () => {
    getAttributeValuesMock.mockResolvedValue({
      ok: true,
      data: [
        {
          id: 3,
          name: 'Blue',
          sortOrder: 0,
          status: 'ACTIVE',
          createdAt: '2026-06-24T20:07:32.467Z',
        },
      ],
    });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('button', { name: 'Actions for Blue' })
    );

    expect(
      await screen.findByRole('menuitem', { name: 'Delete' })
    ).toBeVisible();
    expect(
      screen.queryByRole('menuitem', { name: 'Edit' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', { name: 'Publish' })
    ).not.toBeInTheDocument();
  });

  it('hides the publish action when the parent attribute is a draft', async () => {
    getAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        id: 7,
        name: 'Color',
        sortOrder: 10,
        status: 'DRAFT',
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
          status: 'DRAFT',
          createdAt: '2026-06-24T20:07:32.467Z',
        },
      ],
    });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('button', { name: 'Actions for Blue' })
    );

    expect(
      screen.queryByRole('menuitem', { name: 'Publish' })
    ).not.toBeInTheDocument();
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
      await screen.findByRole('button', { name: 'Actions for Blue' })
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Delete' }));

    const dialog = screen.getByRole('dialog', {
      name: 'Delete attribute value',
    });

    expect(dialog).toBeVisible();
    expect(within(dialog).getByText('Blue')).toBeVisible();
  });

  it('shows bulk actions for selected attribute values', async () => {
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
      await screen.findByRole('checkbox', { name: 'Select Blue' })
    );

    expect(
      screen.getByRole('complementary', {
        name: 'Attribute value bulk actions',
      })
    ).toHaveTextContent('1 selected');

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(
      screen.getByRole('dialog', { name: 'Delete attribute value' })
    ).toBeVisible();
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
