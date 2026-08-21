import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getAttribute, updateAttribute } from '@/lib/client/api/attributes';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { AttributeDetailHeader } from './AttributeDetailHeader';

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  getAttribute: vi.fn(),
  updateAttribute: vi.fn(),
}));

const getAttributeMock = vi.mocked(getAttribute);
const updateAttributeMock = vi.mocked(updateAttribute);

const { setup } = prepareStoreSetup({
  component: AttributeDetailHeader,
  props: {
    attributeId: '7',
  },
});

describe('AttributeDetailHeader', () => {
  beforeEach(() => {
    getAttributeMock.mockReset();
    updateAttributeMock.mockReset();
  });

  it('loads the attribute', async () => {
    getAttributeMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading Attribute...')).toBeVisible();
    await waitFor(() => expect(getAttributeMock).toHaveBeenCalledWith('7'));
  });

  it('renders the attribute name and its actions', async () => {
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

    setup();

    expect(await screen.findByRole('heading', { name: 'Color' })).toBeVisible();
    expect(screen.getByText('Draft')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Publish' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Add Value' })).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Actions for Color' })
    ).toBeVisible();
  });

  it('opens the publish dialog for draft attributes', async () => {
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
    const user = userEvent.setup();

    setup();

    await user.click(await screen.findByRole('button', { name: 'Publish' }));

    expect(
      screen.getByRole('dialog', { name: 'Publish attribute' })
    ).toBeVisible();
  });

  it('publishes the attribute and refreshes the header as active', async () => {
    const draftAttribute = {
      id: 7,
      name: 'Color',
      sortOrder: 10,
      status: 'DRAFT' as const,
      createdAt: '2026-06-24T20:07:32.467Z',
    };
    getAttributeMock
      .mockResolvedValueOnce({
        ok: true,
        data: draftAttribute,
      })
      .mockResolvedValue({
        ok: true,
        data: {
          ...draftAttribute,
          status: 'ACTIVE',
        },
      });
    updateAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        ...draftAttribute,
        status: 'ACTIVE',
      },
    });
    const user = userEvent.setup();

    setup();

    await user.click(await screen.findByRole('button', { name: 'Publish' }));
    await user.click(
      within(
        screen.getByRole('dialog', { name: 'Publish attribute' })
      ).getByRole('button', { name: 'Publish' })
    );

    expect(updateAttributeMock).toHaveBeenCalledWith({
      attributeId: 7,
      status: 'ACTIVE',
    });
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Publish' })
      ).not.toBeInTheDocument()
    );
  });

  it('opens the delete dialog from the actions menu', async () => {
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
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('button', { name: 'Actions for Color' })
    );
    expect(
      await screen.findByRole('menuitem', { name: 'Edit attribute name' })
    ).toBeVisible();
    await user.click(
      await screen.findByRole('menuitem', { name: 'Delete attribute' })
    );

    expect(
      screen.getByRole('dialog', { name: 'Delete attribute' })
    ).toBeVisible();
  });

  it('hides the edit action for active attributes', async () => {
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
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('button', { name: 'Actions for Color' })
    );

    expect(screen.getByText('Active')).toBeVisible();
    expect(
      screen.queryByRole('menuitem', { name: 'Edit attribute name' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Publish' })
    ).not.toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { name: 'Delete attribute' })
    ).toBeVisible();
  });

  it('opens the add values dialog from the main action', async () => {
    getAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        id: 7,
        name: 'Color',
        sortOrder: 10,
        createdAt: '2026-06-24T20:07:32.467Z',
      },
    });
    const user = userEvent.setup();

    setup();

    await user.click(await screen.findByRole('button', { name: 'Add Value' }));

    expect(
      screen.getByRole('dialog', { name: 'Add attribute values' })
    ).toBeVisible();
  });

  it('refreshes the header after updating the attribute name', async () => {
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
    await user.click(screen.getByRole('button', { name: 'Actions for Color' }));
    await user.click(
      await screen.findByRole('menuitem', { name: 'Edit attribute name' })
    );

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

  it('shows an error and retries loading the attribute', async () => {
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
    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByText("We couldn't load this attribute right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByRole('heading', { name: 'Color' })).toBeVisible();
    expect(getAttributeMock).toHaveBeenCalledTimes(2);
  });
});
