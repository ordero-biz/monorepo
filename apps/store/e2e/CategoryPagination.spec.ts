import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import type { Category } from '../src/lib/domain/categories/types';
import { draftSupply } from './fixtures/supply';

const categoryApiPath = '/api/backend/api/v1/categories';

for (const action of ['row', 'bulk'] as const) {
  test(`returns to a valid page after deleting the last category through the ${action} action`, async ({
    context,
    page,
    request,
    baseURL,
  }) => {
    const token = `category-pagination-${randomUUID()}`;
    const endpoint = `http://127.0.0.1:3101/__test/sessions/${token}`;
    const categories: Category[] = Array.from({ length: 11 }, (_, index) => ({
      id: index + 1,
      name: `Category ${index + 1}`,
      sortOrder: index,
      status: 'ACTIVE',
      createdAt: '2026-07-01T00:00:00Z',
      parentCategory: null,
    }));
    const session = await request.put(endpoint, {
      data: {
        categories,
        saved: draftSupply,
        products: [],
        unit: draftSupply.supplyEntries[0].unitOfMeasurement,
      },
    });
    expect(session.ok()).toBeTruthy();

    try {
      await context.addCookies([
        {
          name: 'ordero_access_token',
          value: token,
          url: baseURL,
          httpOnly: true,
          sameSite: 'Lax',
        },
      ]);
      await page.goto('/products/categories?page=2&size=10&sort=name%2Casc');

      if (action === 'row') {
        await page
          .getByRole('button', { name: 'Actions for Category 11' })
          .click();
        await page
          .getByRole('menuitem', { name: 'Delete', exact: true })
          .click();
      } else {
        await page
          .getByRole('checkbox', { name: 'Select Category 11' })
          .check();
        await page.getByRole('button', { name: 'Delete', exact: true }).click();
      }

      const deletion = page.waitForRequest(
        (request) =>
          new URL(request.url()).pathname === categoryApiPath &&
          request.method() === 'DELETE'
      );
      await page
        .getByRole('dialog', { name: 'Delete category', exact: true })
        .getByRole('button', { name: 'Delete', exact: true })
        .click();
      expect((await deletion).postDataJSON()).toEqual({ categoryIds: [11] });

      await expect(page).toHaveURL(
        /\/products\/categories\?page=1&size=10&sort=name%2Casc$/
      );
      await expect(
        page.getByRole('link', { name: 'Category 1', exact: true })
      ).toBeVisible();
      await expect(
        page.getByRole('link', { name: 'Category 11', exact: true })
      ).toHaveCount(0);
      await expect(page.getByText('No categories found.')).toHaveCount(0);
      await expect(
        page.getByRole('navigation', { name: 'Table pagination' })
      ).toContainText('1-10 of 10');
    } finally {
      await request.delete(endpoint);
    }
  });
}
