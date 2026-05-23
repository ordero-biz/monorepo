import { expect, test } from '@playwright/test';

test.describe('store Home', () => {
  test('renders the sign-in entry page', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: /sign in to manage your store/i }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /go to sign in/i })).toHaveAttribute(
      'href',
      '/sign-in',
    );
  });
});
