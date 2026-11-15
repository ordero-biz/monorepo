import { randomUUID } from 'node:crypto';
import { test as base, expect } from '@playwright/test';
import type { Warehouse } from '../src/lib/domain/warehouses/types';
import { draftSupply } from './fixtures/supply';

const backendURL = 'http://127.0.0.1:3101';
const transferPath = '/warehouse/transfers/add';
const mainWarehouse: Warehouse = {
  ...draftSupply.warehouse,
  address: null,
  comment: '',
  phone: null,
  totalItemQuantity: 0,
  totalPrice: 0,
};
const eastWarehouse: Warehouse = {
  ...mainWarehouse,
  id: 3,
  name: 'East Warehouse',
};
const draftWarehouse: Warehouse = {
  ...mainWarehouse,
  id: 4,
  name: 'New Warehouse',
  status: 'DRAFT',
};
const draftWarehousePath = `/api/v1/warehouses/${draftWarehouse.id}`;
const draftWarehouseApiPath = `/api/backend${draftWarehousePath}`;

const test = base.extend<{ publishOutsideTransfer: () => Promise<void> }>({
  publishOutsideTransfer: [
    async ({ context, request, baseURL }, use) => {
      const token = `transfer-${randomUUID()}`;
      const endpoint = `${backendURL}/__test/sessions/${token}`;
      const session = await request.put(endpoint, {
        data: {
          saved: draftSupply,
          products: [],
          unit: draftSupply.supplyEntries[0].unitOfMeasurement,
          warehouses: [mainWarehouse, eastWarehouse, draftWarehouse],
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
        await use(async () => {
          const response = await request.patch(
            `${backendURL}${draftWarehousePath}`,
            {
              data: { status: 'ACTIVE' },
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          expect(response.ok()).toBeTruthy();
        });
      } finally {
        await request.delete(endpoint);
      }
    },
    { auto: true },
  ],
});

test('opens from an active warehouse and selects a different destination', async ({
  page,
}) => {
  await page.goto(`/warehouse/${mainWarehouse.id}`);
  await page
    .getByRole('button', { name: `Actions for ${mainWarehouse.name}` })
    .click();
  await page.getByRole('menuitem', { name: 'Create transfer' }).click();

  await expect(page).toHaveURL(
    `${transferPath}?sourceWarehouseId=${mainWarehouse.id}`
  );
  const form = page.getByRole('form', { name: 'Transfer' });
  const source = form.getByRole('combobox', { name: 'From warehouse' });
  const destination = form.getByRole('combobox', { name: 'To warehouse' });
  await expect(source).toHaveValue(mainWarehouse.name);

  await destination.click();
  await expect(
    page.getByRole('option', { name: mainWarehouse.name, exact: true })
  ).toBeDisabled();
  await page.getByRole('option', { name: eastWarehouse.name }).click();
  await expect(destination).toHaveValue(eastWarehouse.name);
  await form.getByRole('textbox', { name: 'Name' }).fill('Weekend restock');
  await form
    .getByRole('textbox', { name: 'Comment' })
    .fill('Deliver before noon');
  await expect(form.getByRole('textbox', { name: 'Name' })).toHaveValue(
    'Weekend restock'
  );
});

test('recovers from an unavailable source with manual selection', async ({
  page,
}) => {
  await page.goto(`${transferPath}?sourceWarehouseId=999`);
  await expect(
    page.getByText('Choose a source warehouse', { exact: true })
  ).toBeVisible();

  const source = page.getByRole('combobox', { name: 'From warehouse' });
  await expect(source).toHaveValue('');
  await source.click();
  await page.getByRole('option', { name: mainWarehouse.name }).click();
  await expect(source).toHaveValue(mainWarehouse.name);
});

test('cancels a draft source from the URL without selecting it', async ({
  page,
}) => {
  await page.goto(`${transferPath}?sourceWarehouseId=${draftWarehouse.id}`);
  const review = page.getByRole('dialog', { name: 'Publish warehouse?' });
  await expect(review.getByText(draftWarehouse.name)).toBeVisible();
  await expect(review.getByText('Draft', { exact: true })).toBeVisible();
  await expect(
    review.getByRole('link', { name: /View warehouse details/ })
  ).toHaveAttribute('href', `/warehouse/${draftWarehouse.id}`);
  await review.getByRole('button', { name: 'Cancel' }).click();

  const source = page.getByRole('combobox', { name: 'From warehouse' });
  await expect(review).toBeHidden();
  await expect(source).toBeFocused();
  await expect(source).toHaveValue('');
});

test('publishes a draft destination and selects it in the transfer form', async ({
  page,
}) => {
  await page.goto(`${transferPath}?sourceWarehouseId=${mainWarehouse.id}`);
  const name = page.getByRole('textbox', { name: 'Name' });
  await name.fill('Weekend restock');
  const destination = page.getByRole('combobox', { name: 'To warehouse' });
  await destination.click();
  await page
    .getByRole('option', { name: `${draftWarehouse.name} Draft` })
    .click();

  const review = page.getByRole('dialog', { name: 'Publish warehouse?' });
  const publish = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === draftWarehouseApiPath &&
      response.request().method() === 'PATCH'
  );
  await review.getByRole('button', { name: 'Publish and select' }).click();
  const response = await publish;
  expect(response.ok()).toBeTruthy();
  expect(response.request().postDataJSON()).toEqual({ status: 'ACTIVE' });

  await expect(review).toBeHidden();
  await expect(destination).toHaveValue(draftWarehouse.name);
  await expect(name).toHaveValue('Weekend restock');
  await expect(
    page.getByRole('combobox', { name: 'From warehouse' })
  ).toHaveValue(mainWarehouse.name);
});

test('refreshes an open draft review on tab return and waits for selection', async ({
  page,
  publishOutsideTransfer,
}) => {
  await page.goto(`${transferPath}?sourceWarehouseId=${draftWarehouse.id}`);
  const draftReview = page.getByRole('dialog', { name: 'Publish warehouse?' });
  await expect(
    draftReview.getByRole('button', { name: 'Publish and select' })
  ).toBeEnabled();
  await publishOutsideTransfer();

  const refreshed = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === draftWarehouseApiPath &&
      response.request().method() === 'GET'
  );
  await page.bringToFront();
  await page.evaluate(() => {
    document.dispatchEvent(new Event('visibilitychange', { bubbles: true }));
  });
  expect((await refreshed).ok()).toBeTruthy();

  const activeReview = page.getByRole('dialog', { name: 'Select warehouse' });
  await expect(activeReview).toBeVisible();
  await activeReview.getByRole('button', { name: 'Select warehouse' }).click();
  await expect(activeReview).toBeHidden();
  await expect(
    page.getByRole('combobox', { name: 'From warehouse' })
  ).toHaveValue(draftWarehouse.name);
});
