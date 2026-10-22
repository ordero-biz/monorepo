import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import type { CategoriesAsyncCombobox } from '@/features/categories';
import { getAttributesDropdown } from '@/lib/client/api/attributes';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import type { CategorySelection } from '@/lib/domain/categories/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateProduct } from './CreateProduct';

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  getAttributesDropdown: vi.fn(),
}));

const color: AttributeDropdown = {
  id: 1,
  name: 'Color',
  sortOrder: 0,
  status: 'DRAFT',
  createdAt: '2026-10-21T00:00:00Z',
  attributeValues: [
    { id: 11, name: 'Blue', sortOrder: 0, createdAt: '2026-10-21T00:00:00Z' },
    { id: 12, name: 'Red', sortOrder: 1, createdAt: '2026-10-21T00:00:00Z' },
  ],
};
const material: AttributeDropdown = {
  ...color,
  id: 2,
  name: 'Material',
  attributeValues: [
    { ...color.attributeValues[0], id: 21, name: 'Cotton' },
    { ...color.attributeValues[1], id: 22, name: 'Linen' },
  ],
};

const addAttribute = async (
  user: ReturnType<typeof userEvent.setup>,
  name: string
) => {
  await user.click(screen.getByRole('button', { name: 'Add attribute' }));
  await user.click(await screen.findByRole('option', { name }));
};

const selectValues = async (
  user: ReturnType<typeof userEvent.setup>,
  { attribute, values }: { attribute: string; values: string[] }
) => {
  await user.click(
    screen.getByRole('combobox', { name: `Values for ${attribute}` })
  );
  for (const name of values) {
    await user.click(await screen.findByRole('option', { name }));
  }
  await user.keyboard('{Escape}');
};

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/features/categories', () => ({
  CategoriesAsyncCombobox: ({
    errorText,
    onValueChange,
    value,
  }: Pick<
    ComponentProps<typeof CategoriesAsyncCombobox>,
    'errorText' | 'value'
  > & {
    onValueChange: (value: CategorySelection | null) => void;
  }) => (
    <>
      <button
        onClick={() => onValueChange({ id: 2, name: 'Coffee and tea' })}
        type="button"
      >
        {value?.name ?? 'Select category'}
      </button>
      {errorText ? <span>{errorText}</span> : null}
    </>
  ),
}));

const { setup } = prepareStoreSetup({ component: CreateProduct });

describe('New product creation design', () => {
  beforeEach(() => {
    vi.mocked(getAttributesDropdown).mockReset();
    vi.mocked(getAttributesDropdown).mockResolvedValue({
      ok: true,
      data: [color, material],
    });
  });

  it('replaces the attribute picker with values, prevents duplicates, and clears removed values', async () => {
    const user = userEvent.setup();
    setup();

    expect(
      screen.queryByRole('combobox', { name: 'Attribute' })
    ).not.toBeInTheDocument();
    await addAttribute(user, 'Color');
    expect(
      screen.queryByRole('combobox', { name: 'Attribute' })
    ).not.toBeInTheDocument();
    const values = screen.getByRole('combobox', { name: 'Values for Color' });
    expect(values).toBeVisible();
    expect(values).toHaveFocus();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Color' })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Color added. Select its values.'
    );
    await selectValues(user, { attribute: 'Color', values: ['Blue'] });
    await user.click(screen.getByRole('button', { name: 'Add attribute' }));
    expect(
      await screen.findByRole('option', { name: 'Color' })
    ).toHaveAttribute('aria-disabled', 'true');
    await user.click(screen.getByRole('option', { name: 'Material' }));
    await selectValues(user, { attribute: 'Material', values: ['Cotton'] });
    await user.click(
      screen.getByRole('button', { name: 'Remove Color attribute' })
    );
    expect(
      screen.queryByRole('combobox', { name: 'Values for Color' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Cotton' })).toBeVisible();

    await addAttribute(user, 'Color');
    expect(
      screen.queryByRole('button', { name: 'Remove Blue' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Cotton' })).toBeVisible();
  }, 15000);

  it('can cancel adding an attribute without changing existing selections', async () => {
    const user = userEvent.setup();
    setup();
    await addAttribute(user, 'Color');
    await selectValues(user, { attribute: 'Color', values: ['Blue'] });
    await user.click(screen.getByRole('button', { name: 'Add attribute' }));
    await user.keyboard('{Escape}');
    await user.click(
      screen.getByRole('button', { name: 'Cancel adding attribute' })
    );
    expect(
      screen.queryByRole('combobox', { name: 'Attribute' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Blue' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Add attribute' })).toBeVisible();
  });

  it('requires an attribute and selected values for combinations, then generates their combinations', async () => {
    const user = userEvent.setup();
    setup();
    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Shirt'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await user.click(screen.getByRole('radio', { name: 'Value combinations' }));
    await user.click(
      screen.getByRole('button', { name: 'Continue to variants' })
    );
    expect(
      await screen.findByText('Select at least one attribute.')
    ).toBeVisible();
    await addAttribute(user, 'Color');
    await user.click(
      screen.getByRole('button', { name: 'Continue to variants' })
    );
    expect(
      await screen.findByText('Select at least one attribute value.')
    ).toBeVisible();
    await selectValues(user, { attribute: 'Color', values: ['Blue', 'Red'] });
    await addAttribute(user, 'Material');
    await selectValues(user, {
      attribute: 'Material',
      values: ['Cotton', 'Linen'],
    });
    expect(
      screen.queryByText('Select at least one attribute.')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Select at least one attribute value.')
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Continue to variants' })
    );

    const configuration = await screen.findByRole('form', {
      name: 'Product configuration',
    });
    for (const name of [
      'Shirt Blue Cotton',
      'Shirt Blue Linen',
      'Shirt Red Cotton',
      'Shirt Red Linen',
    ]) {
      expect(within(configuration).getByRole('button', { name })).toBeVisible();
    }
  }, 15000);

  it('keeps all selected values on a single generated variant in single mode', async () => {
    const user = userEvent.setup();
    setup();
    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Shirt'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await addAttribute(user, 'Color');
    await selectValues(user, { attribute: 'Color', values: ['Blue', 'Red'] });
    await user.click(
      screen.getByRole('button', { name: 'Continue to variants' })
    );

    const configuration = await screen.findByRole('form', {
      name: 'Product configuration',
    });
    expect(
      within(configuration).getByRole('button', {
        name: 'Shirt Blue Red',
      })
    ).toBeVisible();
    expect(screen.getByText('1 product variant ready')).toBeVisible();
  });

  it('lets users choose how variants are generated', async () => {
    const user = userEvent.setup();
    setup();

    const singleVariant = screen.getByRole('radio', { name: 'Single variant' });
    const valueCombinations = screen.getByRole('radio', {
      name: 'Value combinations',
    });
    expect(singleVariant).toBeChecked();
    expect(valueCombinations).not.toBeChecked();

    await user.click(valueCombinations);
    expect(valueCombinations).toBeChecked();
    expect(singleVariant).not.toBeChecked();

    await user.click(screen.getByText('Single variant'));
    expect(singleVariant).toBeChecked();
    expect(valueCombinations).not.toBeChecked();
  });

  it('validates required shared details before continuing to variants', async () => {
    const user = userEvent.setup();
    setup();

    expect(
      screen.queryByText('Product name is required')
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Continue to variants' })
    );

    expect(await screen.findByText('Product name is required')).toBeVisible();
    expect(screen.getByText('Category is required')).toBeVisible();
    expect(
      screen.getByRole('form', { name: 'Product generation' })
    ).toBeVisible();
    expect(
      screen.queryByRole('form', { name: 'Product configuration' })
    ).not.toBeInTheDocument();
  });

  it('continues to variant configuration with the entered shared details', async () => {
    const user = userEvent.setup();
    setup();

    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Kilograms coffee'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await user.type(
      screen.getByRole('textbox', { name: 'Description' }),
      'Freshly roasted coffee.'
    );
    await user.click(
      screen.getByRole('button', { name: 'Continue to variants' })
    );

    const configuration = await screen.findByRole('form', {
      name: 'Product configuration',
    });
    expect(
      within(configuration).getByRole('textbox', { name: 'Base product name' })
    ).toHaveValue('Kilograms coffee');
    expect(
      within(
        within(configuration).getByRole('region', { name: 'Common product' })
      ).getByRole('textbox', {
        name: 'Description',
      })
    ).toHaveValue('Freshly roasted coffee.');
    expect(
      within(configuration).getByRole('button', { name: 'Coffee and tea' })
    ).toBeVisible();
    expect(
      within(configuration).getByRole('button', { name: 'Kilograms coffee' })
    ).toBeVisible();
    expect(
      screen.queryByRole('form', { name: 'Product generation' })
    ).not.toBeInTheDocument();
  });
});
