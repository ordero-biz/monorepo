import { screen } from '@testing-library/react';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { AttributesListHeader } from './AttributesListHeader';

vi.mock('../CreateAttribute', () => ({
  CreateAttributeDialogTrigger: () => (
    <button type="button">Add Attribute</button>
  ),
}));

const { setup } = prepareStoreSetup({
  component: AttributesListHeader,
});

describe('AttributesListHeader', () => {
  it('renders the attributes title and create action', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Attributes list' })
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Add Attribute' })
    ).toBeVisible();
  });
});
