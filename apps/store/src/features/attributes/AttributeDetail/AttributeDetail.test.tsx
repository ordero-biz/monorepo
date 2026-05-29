import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getAttribute } from '@/lib/client/api';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { AttributeDetail } from './AttributeDetail';

vi.mock('@/lib/client/api', async () => {
  const actual =
    await vi.importActual<typeof import('@/lib/client/api')>(
      '@/lib/client/api'
    );

  return {
    ...actual,
    getAttribute: vi.fn(),
  };
});

const getAttributeMock = vi.mocked(getAttribute);

const { setup } = prepareStoreSetup({
  component: AttributeDetail,
  props: {
    attributeId: '1',
  },
});

describe('AttributeDetail', () => {
  beforeEach(() => {
    getAttributeMock.mockReset();
  });

  it('renders a loading state while the attribute is loading', () => {
    getAttributeMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading attribute...')).toBeVisible();
  });

  it('renders an error state and retries loading the attribute', async () => {
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
          id: 1,
          name: 'Size',
          sortOrder: 10,
          values: ['S', 'M', 'L'],
          createdAt: '2026-05-26T20:55:51.542Z',
        },
      });

    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByText("We couldn't load this attribute right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Attribute Size')).toBeVisible();
    expect(getAttributeMock).toHaveBeenCalledTimes(2);
  });

  it('renders the attribute title and details', async () => {
    getAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Size',
        sortOrder: 10,
        values: ['S', 'M', 'L'],
        createdAt: '2026-05-26T20:55:51.542Z',
      },
    });

    setup();

    expect(await screen.findByText('Attribute Size')).toBeVisible();
    expect(screen.getByText('S, M, L')).toBeVisible();
    expect(screen.getByText('26 May 2026')).toBeVisible();
  });
});
