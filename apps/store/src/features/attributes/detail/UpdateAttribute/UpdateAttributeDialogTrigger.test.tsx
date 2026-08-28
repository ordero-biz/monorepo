import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateAttribute } from '@/lib/client/api/attributes';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UpdateAttributeDialogTrigger } from './UpdateAttributeDialogTrigger';

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  updateAttribute: vi.fn(),
}));

const updateAttributeMock = vi.mocked(updateAttribute);

const { setup } = prepareStoreSetup({
  component: UpdateAttributeDialogTrigger,
  props: {
    attribute: {
      id: 7,
      name: 'Color',
      sortOrder: 10,
      status: 'DRAFT' as const,
      createdAt: '2026-06-24T20:07:32.467Z',
    },
    onUpdated: vi.fn(),
  },
});

describe('UpdateAttributeDialogTrigger', () => {
  beforeEach(() => {
    updateAttributeMock.mockReset();
  });

  it('opens the update attribute dialog', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Edit Color' }));

    expect(
      screen.getByRole('dialog', { name: 'Edit Attribute' })
    ).toBeVisible();
  });

  it('resets an unsaved name when the dialog is closed and reopened', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Edit Color' }));

    const nameField = screen.getByRole('textbox', {
      name: 'Attribute name',
    });

    await user.clear(nameField);
    await user.type(nameField, 'Material');
    await user.keyboard('{Escape}');

    expect(
      screen.queryByRole('dialog', { name: 'Edit Attribute' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Edit Color' }));

    expect(screen.getByRole('textbox', { name: 'Attribute name' })).toHaveValue(
      'Color'
    );
  });

  it('uses the saved values when the dialog is reopened after an update', async () => {
    const updatedAttribute = {
      id: 7,
      name: 'Material',
      sortOrder: 10,
      status: 'DRAFT' as const,
      createdAt: '2026-06-25T18:13:29.608Z',
    };
    updateAttributeMock.mockResolvedValue({ ok: true, data: updatedAttribute });
    const user = userEvent.setup();

    const { renderResult } = setup();

    await user.click(screen.getByRole('button', { name: 'Edit Color' }));

    const nameField = screen.getByRole('textbox', {
      name: 'Attribute name',
    });

    await user.clear(nameField);
    await user.type(nameField, ' Material ');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByText('Attribute Material was updated')
    ).toBeVisible();
    expect(
      screen.queryByRole('dialog', { name: 'Edit Attribute' })
    ).not.toBeInTheDocument();

    renderResult.rerender({ attribute: updatedAttribute });

    await user.click(screen.getByRole('button', { name: 'Edit Material' }));

    expect(screen.getByRole('textbox', { name: 'Attribute name' })).toHaveValue(
      'Material'
    );
  });
});
