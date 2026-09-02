import { screen, within } from '@testing-library/react';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UnitsOfMeasurementListHeader } from './UnitsOfMeasurementListHeader';

vi.mock('../CreateUnitOfMeasurement', () => ({
  CreateUnitOfMeasurementDialogTrigger: () => (
    <button type="button">Add Unit of Measurement</button>
  ),
}));

const { setup } = prepareStoreSetup({
  component: UnitsOfMeasurementListHeader,
});

describe('UnitsOfMeasurementListHeader', () => {
  it('renders the units of measurement title and create action', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Units of measurement list' })
    ).toBeVisible();
    expect(
      within(screen.getByRole('navigation', { name: 'Breadcrumb' })).getByText(
        'Units of measurement'
      )
    ).toHaveAttribute('aria-current', 'page');
    expect(
      screen.getByRole('button', { name: 'Add Unit of Measurement' })
    ).toBeVisible();
  });
});
