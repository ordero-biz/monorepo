import { expect, test } from '@playwright/test';

test.describe('LogInForm', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/log-in');
  });

  test('shows validation feedback for invalid credentials', async ({ page }) => {
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

  test('keeps the email and clears the password after successful sign in', async ({
    page,
  }) => {
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
