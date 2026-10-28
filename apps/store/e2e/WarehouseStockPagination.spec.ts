import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import type { WarehouseStockItem } from '../src/lib/domain/warehouses/types';
import { draftSupply } from './fixtures/supply';

test('paginates warehouse stock through the URL, reload, and browser history', async ({
  context,
  page,
  request,
  baseURL,
}, testInfo) => {
  const token = `warehouse-stock-${randomUUID()}`;
  const endpoint = `http://127.0.0.1:3101/__test/sessions/${token}`;
  const warehouseStock: WarehouseStockItem[] = Array.from(
    { length: 26 },
    (_, index) => ({
      productVariant: {
        id: index + 1,
        name: `Stock product ${index + 1}`,
        sku: `SKU-${index + 1}`,
        barcode: `BARCODE-${index + 1}`,
      },
      unitOfMeasurement: draftSupply.supplyEntries[0].unitOfMeasurement,
      quantity: index + 1,
      totalPrice: (index + 1) * 2.5,
    })
  );
  const session = await request.put(endpoint, {
    data: {
      saved: draftSupply,
      products: [],
      unit: draftSupply.supplyEntries[0].unitOfMeasurement,
      warehouseStock,
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
    await page.goto('/warehouse/2?page=2&size=10');
    await expect(
      page.getByRole('heading', { name: 'Main Warehouse' })
    ).toBeVisible();
    const table = page.getByRole('table', { name: 'Warehouse products' });
    const inventoryValue = page.getByRole('region', {
      name: 'Inventory value',
    });
    await expect(inventoryValue.getByText('$877.50')).toBeVisible();
    await expect(inventoryValue.getByText('USD')).toBeVisible();
    await expect(
      table.getByText('Stock product 11', { exact: true })
    ).toBeVisible();
    await expect(
      table.getByText('Stock product 1', { exact: true })
    ).toHaveCount(0);
    await expect(page.getByText('11-20 of 26')).toBeVisible();

    await page.getByRole('button', { name: 'Go to next page' }).click();
    await expect(page).toHaveURL(/page=3&size=10/);
    await expect(
      table.getByText('Stock product 21', { exact: true })
    ).toBeVisible();
    await expect(page.getByText('21-26 of 26')).toBeVisible();
    await expect(inventoryValue.getByText('$877.50')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Go to next page' })
    ).toBeDisabled();

    await page.reload();
    await expect(
      table.getByText('Stock product 21', { exact: true })
    ).toBeVisible();
    // Server-rendered rows can appear before the client router is hydrated.
    await page.getByRole('combobox', { name: 'Rows per page' }).click();
    await expect(
      page.getByRole('option', { name: '25', exact: true })
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await page.goBack();
    await expect(page).toHaveURL(/page=2&size=10/);
    await expect(
      table.getByText('Stock product 11', { exact: true })
    ).toBeVisible();

    await page.getByRole('combobox', { name: 'Rows per page' }).click();
    await page.getByRole('option', { name: '25', exact: true }).click();
    await expect(page).toHaveURL(/page=1&size=25/);
    await expect(
      table.getByText('Stock product 1', { exact: true })
    ).toBeVisible();
    await expect(
      table.getByText('Stock product 25', { exact: true })
    ).toBeVisible();
    await expect(page.getByText('1-25 of 26')).toBeVisible();

    await page.goto('/warehouse/2?page=99&size=10');
    await expect(page).toHaveURL(/page=3&size=10/);
    await expect(
      table.getByText('Stock product 21', { exact: true })
    ).toBeVisible();
    await expect(page.getByText('21-26 of 26')).toBeVisible();
    await page.reload();
    await expect(page).toHaveURL(/page=3&size=10/);
    await expect(
      table.getByText('Stock product 21', { exact: true })
    ).toBeVisible();
    await page.screenshot({
      path: testInfo.outputPath('warehouse-desktop.png'),
      fullPage: true,
    });
  } finally {
    await request.delete(endpoint);
  }
});
