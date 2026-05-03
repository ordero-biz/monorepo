import { render, screen, within } from '@testing-library/react';
import { AuthPageShell } from './AuthPageShell';

describe('AuthPageShell', () => {
  it('renders its children inside the page main landmark', () => {
    render(
      <AuthPageShell>
        <h1>Auth content</h1>
      </AuthPageShell>
    );

    const main = screen.getByRole('main');

    expect(
      within(main).getByRole('heading', { name: 'Auth content' })
    ).toBeVisible();
  });
});
