import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import type { WarehouseSupply } from '../src/lib/domain/warehouses/types';
import { draftSupply } from './fixtures/supply';

test('switches warehouse lists and preserves supplies through pagination, reload and history', async ({
  context,
  page,
  request,
  baseURL,
}, testInfo) => {
  const token = `warehouse-supplies-${randomUUID()}`;
  const endpoint = `http://127.0.0.1:3101/__test/sessions/${token}`;
  const warehouseSupplies: WarehouseSupply[] = Array.from(
    { length: 12 },
    (_, index) => ({
      id: index === 0 ? draftSupply.id : 100 + index,
      supplier: draftSupply.supplier,
      status: index === 0 ? 'DRAFT' : 'COMPLETED',
      supplyNumber: `Supply ${index + 1}`,
      supplierInvoiceNumber: `INV-${index + 1}`,
      createdAt: '2026-10-28T10:00:00Z',
      totalPrice: (index + 1) * 10,
    })
  );
  const response = await request.put(endpoint, {
    data: {
      saved: draftSupply,
      products: [],
      unit: draftSupply.supplyEntries[0].unitOfMeasurement,
      warehouseSupplies,
      warehouseStock: [
        {
          productVariant: { id: 11, name: 'Rice', sku: 'RICE', barcode: '11' },
          unitOfMeasurement: draftSupply.supplyEntries[0].unitOfMeasurement,
          quantity: 2,
          totalPrice: 10,
        },
      ],
    },
  });
  expect(response.ok()).toBeTruthy();
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
    await page.goto('/warehouse/2');
    const products = page.getByRole('table', { name: 'Warehouse products' });
    const supplies = page.getByRole('table', { name: 'Warehouse supplies' });
    const value = page.getByRole('region', { name: 'Inventory value' });
    await expect(products.getByText('Rice', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Supplies', exact: true }).click();
    await expect(page).toHaveURL(/view=supplies/);
    await expect(
      supplies.getByRole('link', { name: 'Supply 1', exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Supplies', pressed: true })
    ).toBeVisible();
    await expect(value.getByText('$10.00')).toBeVisible();
    await expect(page.getByText('1-10 of 12')).toBeVisible();
    await expect(products).toHaveCount(0);
    await page.getByRole('button', { name: 'Go to next page' }).click();
    await expect(page).toHaveURL(/page=2/);
    await expect(
      supplies.getByRole('link', { name: 'Supply 11', exact: true })
    ).toBeVisible();
    await expect(page.getByText('11-12 of 12')).toBeVisible();
    await page.reload();
    await expect(
      supplies.getByRole('link', { name: 'Supply 11', exact: true })
    ).toBeVisible();
    await expect(value.getByText('$10.00')).toBeVisible();
    await page.getByRole('button', { name: 'Products', exact: true }).click();
    await expect(page).toHaveURL(/view=products/);
    await expect(page).toHaveURL(/page=1/);
    await expect(products.getByText('Rice', { exact: true })).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/view=supplies/);
    await expect(
      supplies.getByRole('link', { name: 'Supply 11', exact: true })
    ).toBeVisible();
    await page.getByRole('button', { name: 'Go to previous page' }).click();
    await expect(
      supplies.getByRole('link', { name: 'Supply 1', exact: true })
    ).toBeVisible();
    await page.screenshot({
      path: testInfo.outputPath('warehouse-supplies-desktop.png'),
      fullPage: true,
    });
    await supplies.getByRole('link', { name: 'Supply 1', exact: true }).click();
    await expect(page).toHaveURL('/warehouse/supplies/9');
    await page.goBack();
    await expect(page).toHaveURL(/view=supplies/);
    await expect(
      supplies.getByRole('link', { name: 'Supply 1', exact: true })
    ).toBeVisible();
  } finally {
    await request.delete(endpoint);
  }
});
