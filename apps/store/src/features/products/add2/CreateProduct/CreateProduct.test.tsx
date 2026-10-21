import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import type { CategoriesAsyncCombobox } from '@/features/categories';
import type { CategorySelection } from '@/lib/domain/categories/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateProduct } from './CreateProduct';

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
