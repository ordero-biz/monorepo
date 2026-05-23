import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { AddStorePage } from './AddStorePage';

const { setup } = preparePlatformSetup({
  component: AddStorePage,
});

describe('AddStorePage', () => {
  it('renders the store domain and name form fields', async () => {
    const user = userEvent.setup();
    setup();

    const domainField = screen.getByRole('textbox', { name: 'Domain' });
    const nameField = screen.getByRole('textbox', { name: 'Name' });

    expect(screen.getByRole('heading', { name: 'Add store' })).toBeVisible();
    expect(domainField).toBeVisible();
    expect(screen.getByText('.ordero.biz')).toBeVisible();
    expect(nameField).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Create store' })
    ).toHaveAttribute('type', 'submit');

    await user.type(domainField, 'north-shop');
    await user.type(nameField, 'North Shop');

    expect(domainField).toHaveValue('north-shop');
    expect(nameField).toHaveValue('North Shop');
  });
});
