import { expect, test } from '@playwright/test';

test.describe('SignUpForm', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-up');
  });

  test('renders the sign-up page, footer link, and form controls', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { name: 'Get started' }),
    ).toBeVisible();
    await expect(
      page.getByText('Please enter your details to get started'),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/sign-in',
    );
    await expect(
      page.getByRole('textbox', { name: 'Email address' }),
    ).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: 'Password' }),
    ).toBeVisible();
    await expect(
      page.getByRole('checkbox', {
        name: /by signing up, i agree to/i,
      }),
    ).not.toBeChecked();
    await expect(
      page.getByRole('link', { name: 'terms of use' }),
    ).toHaveAttribute('href', '/terms');
    await expect(
      page.getByRole('link', { name: 'privacy policy' }),
    ).toHaveAttribute('href', '/privacy');
    await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
  });

  test('shows checkbox validation when the user submits without accepting terms', async ({
    page,
  }) => {
    const emailField = page.getByRole('textbox', { name: 'Email address' });
    const passwordField = page.getByRole('textbox', { name: 'Password' });

    await emailField.pressSequentially('admin@gmail.com');
    await passwordField.pressSequentially('123456');
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(
      page.getByText('You must accept the terms to continue.'),
    ).toBeVisible();
  });

  test('shows client validation errors when the user submits the untouched form', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(
      page.getByText('Enter a valid email address.'),
    ).toBeVisible();
    await expect(
      page.getByText('Password must contain at least 6 characters.'),
    ).toBeVisible();
  });

  test('keeps the email and clears the password and checkbox after successful sign up', async ({
    page,
  }) => {
    const expectedCredentials = {
      email: 'admin@gmail.com',
      password: '123456',
    };

    await page.route('**/api/auth/sign-up', async (route) => {
      await route.fulfill({
        json: {
          authenticated: true,
        },
      });
    });

    const emailField = page.getByRole('textbox', { name: 'Email address' });
    const passwordField = page.getByRole('textbox', { name: 'Password' });
    const termsCheckbox = page.getByRole('checkbox', {
      name: /by signing up, i agree to/i,
    });

    await emailField.pressSequentially(expectedCredentials.email);
    await passwordField.pressSequentially(expectedCredentials.password);
    await termsCheckbox.check();

    const signUpRequestPromise = page.waitForRequest('**/api/auth/sign-up');

    await page.getByRole('button', { name: 'Sign up' }).click();

    const signUpRequest = await signUpRequestPromise;

    expect(signUpRequest.method()).toBe('POST');
    expect(signUpRequest.postDataJSON()).toEqual(expectedCredentials);
    await expect(emailField).toHaveValue(expectedCredentials.email);
    await expect(passwordField).toHaveValue('');
    await expect(termsCheckbox).not.toBeChecked();
  });

  test('shows a toast when sign up fails with a form-level backend error', async ({
    page,
  }) => {
    await page.route('**/api/auth/sign-up', async (route) => {
      await route.fulfill({
        status: 500,
        json: {
          status: 500,
          message: 'Unable to create account.',
        },
      });
    });

    const emailField = page.getByRole('textbox', { name: 'Email address' });
    const passwordField = page.getByRole('textbox', { name: 'Password' });
    const termsCheckbox = page.getByRole('checkbox', {
      name: /by signing up, i agree to/i,
    });

    await emailField.pressSequentially('admin@gmail.com');
    await passwordField.pressSequentially('123456');
    await termsCheckbox.check();

    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(
      page.getByRole('dialog', { name: 'Unable to create account.' }),
    ).toBeVisible();
    await expect(passwordField).toHaveValue('123456');
    await expect(termsCheckbox).toBeChecked();
  });
});
