import { randomUUID } from 'node:crypto';
import { test as base, expect, type Page } from '@playwright/test';
import type { ProductVariant } from '../../src/lib/domain/products/types';
import type { SupplyDetails } from '../../src/lib/domain/supplies/types';

const backendURL = 'http://127.0.0.1:3101';
export const supplyPath = '/warehouse/supplies/9';
export const supplyApiPath = '/api/backend/api/v1/supplies/9';

export const products: ProductVariant[] = [
  { id: 11, name: 'Rice', sku: 'RICE' },
  { id: 12, name: 'Oats', sku: 'OATS' },
  { id: 13, name: 'Lentils', sku: 'LENTILS' },
].map((product) => ({
  ...product,
  description: '',
  status: 'ACTIVE',
  barcode: String(product.id),
  createdAt: '2026-01-01T00:00:00Z',
  productVariantAttributeValues: [],
}));

export const draftSupply: SupplyDetails = {
  completedAt: null,
  completedBy: null,
  createdAt: '2026-10-28T10:00:00Z',
  createdBy: 'owner@example.test',
  updatedAt: '2026-10-28T10:00:00Z',
  updatedBy: 'owner@example.test',

  id: 9,
  version: 1,
  status: 'DRAFT',
  supplyNumber: 'SUP-009',
  supplierInvoiceNumber: 'INV-ORIGINAL',
  comment: 'Original saved comment',
  supplier: { id: 1, name: 'Fresh Farms', status: 'ACTIVE' },
  warehouse: { id: 2, name: 'Main Warehouse', status: 'ACTIVE' },

  totalPrice: 10,
  supplyEntries: [
    {
      comment: null,

      id: 17,
      productVariant: {
        barcode: '',
        id: 11,
        name: 'Rice',
        sku: 'RICE',
      },
      unitOfMeasurement: {
        id: 3,
        name: 'Bag',
        symbol: 'bag',
        status: 'ACTIVE',
      },
      quantity: 2,
      unitPrice: 5,
    },
  ],
};

type SupplyFixtures = {
  savedSupply: {
    replace: (changes: Partial<SupplyDetails>) => Promise<SupplyDetails>;
    failReads: (fail: boolean) => Promise<void>;
  };
  capture: (name: string) => Promise<void>;
};

export const test = base.extend<SupplyFixtures>({
  savedSupply: [
    async ({ context, request, baseURL }, use) => {
      const token = `supply-e2e-${randomUUID()}`;
      const endpoint = `${backendURL}/__test/sessions/${token}`;
      const initialResponse = await request.put(endpoint, {
        data: {
          saved: draftSupply,
          products,
          unit: draftSupply.supplyEntries[0].unitOfMeasurement,
        },
      });
      expect(initialResponse.ok()).toBeTruthy();
      await context.addCookies([
        {
          name: 'ordero_access_token',
          value: token,
          url: baseURL,
          httpOnly: true,
          sameSite: 'Lax',
        },
      ]);
      await use({
        replace: async (changes) => {
          const response = await request.get(endpoint);
          expect(response.ok()).toBeTruthy();
          const session = await response.json();
          const saved: SupplyDetails = {
            ...session.saved,
            version: session.saved.version + 1,
            ...changes,
          };
          const update = await request.put(endpoint, {
            data: { ...session, saved },
          });
          expect(update.ok()).toBeTruthy();
          return saved;
        },
        failReads: async (readError) => {
          const response = await request.get(endpoint);
          expect(response.ok()).toBeTruthy();
          const session = await response.json();
          const update = await request.put(endpoint, {
            data: { ...session, readError },
          });
          expect(update.ok()).toBeTruthy();
        },
      });
      await request.delete(endpoint);
    },
    { auto: true },
  ],
  capture: async ({ page }, use, testInfo) => {
    await use(async (name) => {
      await testInfo.attach(name, {
        body: await page.screenshot({ fullPage: true, animations: 'disabled' }),
        contentType: 'image/png',
      });
    });
  },
});

export { expect } from '@playwright/test';

// Playwright keeps Chromium tabs focused/visible, including background tabs.
// Dispatch the browser event used when returning to a tab; Query performs its
// normal refetch. The fixture never accesses the application's cache or form.
export const returnToEditor = async (page: Page) => {
  await test.step('Simulate returning to the tab and wait for the saved supply request', async () => {
    const refreshed = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === supplyApiPath &&
        response.request().method() === 'GET'
    );
    await page.bringToFront();
    await page.evaluate(() => {
      document.dispatchEvent(new Event('visibilitychange', { bubbles: true }));
    });
    await refreshed;
  });
};
