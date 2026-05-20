import { expect, test } from '@playwright/test';

test.describe('SignInForm', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
  });

  test('renders the sign-in page, footer link, and form controls', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { name: 'Welcome back!' }),
    ).toBeVisible();
    await expect(
      page.getByText('Please enter your details to get started'),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Create account' }),
    ).toHaveAttribute('href', '/sign-up');
    await expect(
      page.getByRole('textbox', { name: 'Email address' }),
    ).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: 'Password' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Forgot password?' }),
    ).toHaveAttribute('type', 'button');
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('shows validation feedback for invalid credentials', async ({ page }) => {
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 422,
        json: {
          status: 422,
          message: 'Sign-in failed.',
          fieldErrors: {
            email: 'Use a gmail.com email address.',
          },
        },
      });
    });

    const emailField = page.getByRole('textbox', { name: 'Email address' });
    const passwordField = page.getByRole('textbox', { name: 'Password' });

    await emailField.pressSequentially('admin@mail.com');
    await passwordField.pressSequentially('123456');

    await expect(emailField).toHaveValue('admin@mail.com');
    await expect(passwordField).toHaveValue('123456');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(
      page.getByText('Use a gmail.com email address.'),
    ).toBeVisible();
  });

  test('shows client validation errors when the user submits the untouched form', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(
      page.getByText('Enter a valid email address.'),
    ).toBeVisible();
    await expect(
      page.getByText('Password must contain at least 6 characters.'),
    ).toBeVisible();
  });

  test('keeps the email and clears the password after successful sign in', async ({
    page,
  }) => {
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        json: {
          authenticated: true,
          user: {
            email: 'admin@gmail.com',
          },
        },
      });
    });

    const emailField = page.getByRole('textbox', { name: 'Email address' });
    const passwordField = page.getByRole('textbox', { name: 'Password' });

    await emailField.pressSequentially('admin@gmail.com');
    await passwordField.pressSequentially('123456');

    await expect(emailField).toHaveValue('admin@gmail.com');
    await expect(passwordField).toHaveValue('123456');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(emailField).toHaveValue('admin@gmail.com');
    await expect(passwordField).toHaveValue('');
  });
});
