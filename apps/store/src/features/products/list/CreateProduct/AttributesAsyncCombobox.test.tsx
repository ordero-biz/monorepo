import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getAttributesDropdown } from '@/lib/client/api/attributes';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { AttributesAsyncCombobox } from './AttributesAsyncCombobox';

const mocks = vi.hoisted(() => ({
  getAttributesDropdown: vi.fn(),
  onSelectedAttributesChange: vi.fn(),
  onValueChange: vi.fn(),
}));

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  getAttributesDropdown: mocks.getAttributesDropdown,
}));

const getAttributesDropdownMock = vi.mocked(getAttributesDropdown);

const { setup } = prepareStoreSetup({
  component: AttributesAsyncCombobox,
  props: {
    'aria-label': 'Attributes',
    multiple: true,
    onSelectedAttributesChange: mocks.onSelectedAttributesChange,
    onValueChange: mocks.onValueChange,
    placeholder: 'Select attributes',
  },
});

describe('AttributesAsyncCombobox', () => {
  beforeEach(() => {
    getAttributesDropdownMock.mockReset();
    mocks.onSelectedAttributesChange.mockReset();
    mocks.onValueChange.mockReset();
  });

  const mockSuccessfulAttributes = () => {
    getAttributesDropdownMock.mockResolvedValue({
      ok: true,
      data: [
        {
          id: 1,
          name: 'Color',
          sortOrder: 10,
          status: 'DRAFT' as const,
          createdAt: '2026-07-14T17:54:42.035Z',
          attributeValues: [
            {
              id: 3,
              name: 'Blue',
              sortOrder: 0,
              status: 'DRAFT' as const,
              createdAt: '2026-07-14T17:54:42.036Z',
            },
          ],
        },
      ],
    });
  };

  it('calls selected attribute handlers when the user picks an attribute', async () => {
    const user = userEvent.setup();

    mockSuccessfulAttributes();

    setup();

    await user.click(screen.getByRole('combobox', { name: 'Attributes' }));
    await user.click(await screen.findByRole('option', { name: 'Color' }));

    expect(getAttributesDropdownMock).toHaveBeenCalledWith();
    expect(mocks.onValueChange).toHaveBeenLastCalledWith(
      ['1'],
      expect.any(Object)
    );
    expect(mocks.onSelectedAttributesChange).toHaveBeenLastCalledWith([
      {
        id: 1,
        name: 'Color',
        sortOrder: 10,
        status: 'DRAFT' as const,
        createdAt: '2026-07-14T17:54:42.035Z',
        attributeValues: [
          {
            id: 3,
            name: 'Blue',
            sortOrder: 0,
            status: 'DRAFT' as const,
            createdAt: '2026-07-14T17:54:42.036Z',
          },
        ],
      },
    ]);
  });

  it('refetches when attribute list queries are invalidated', async () => {
    const user = userEvent.setup();

    mockSuccessfulAttributes();
    const { queryClient } = setup();

    await user.click(screen.getByRole('combobox', { name: 'Attributes' }));

    await waitFor(() =>
      expect(getAttributesDropdownMock).toHaveBeenCalledTimes(1)
    );

    await queryClient.invalidateQueries({
      queryKey: attributesQueryKeys.list,
    });

    await waitFor(() =>
      expect(getAttributesDropdownMock).toHaveBeenCalledTimes(2)
    );
  });

  it('shows an empty state when no attributes are available', async () => {
    getAttributesDropdownMock.mockResolvedValue({
      ok: true,
      data: [],
    });
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('combobox', { name: 'Attributes' }));

    expect(await screen.findByText('No attributes found')).toBeVisible();
  });

  it('shows a load error when attributes cannot be retrieved', async () => {
    getAttributesDropdownMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Could not load attributes.',
      },
    });
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('combobox', { name: 'Attributes' }));

    expect(
      await screen.findByText("We couldn't load attributes right now.")
    ).toBeVisible();
  });
});
