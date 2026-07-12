import { screen } from '@testing-library/react';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SignInFormLayout } from './SignInLayout';

vi.mock('./SignInForm', () => ({
  SignInForm: () => <div>Sign in form</div>,
}));

const { setup } = prepareStoreSetup({
  component: SignInFormLayout,
});

describe('SignInFormLayout', () => {
  it('renders the sign-in layout copy without sign-up navigation', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Welcome back!' })
    ).toBeVisible();
    expect(
      screen.getByText('Please enter your details to get started')
    ).toBeVisible();
    expect(screen.getByText('Sign in form')).toBeVisible();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
