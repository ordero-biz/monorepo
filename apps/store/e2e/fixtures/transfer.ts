import { randomUUID } from 'node:crypto';
import { test as base, expect, type Page } from '@playwright/test';
import type { TransferDetails } from '../../src/lib/domain/transfers/types';
import type {
  Warehouse,
  WarehouseStockItem,
} from '../../src/lib/domain/warehouses/types';
import { draftSupply, products } from './supply';

const backendURL = 'http://127.0.0.1:3101';
export const transferPath = '/warehouse/transfers/9';
export const transferApiPath = '/api/backend/api/v1/warehouse-transfers/9';

const unit = draftSupply.supplyEntries[0].unitOfMeasurement;

export const mainWarehouse: Warehouse = {
  id: 2,
  name: 'Main Warehouse',
  status: 'ACTIVE',
  address: null,
  comment: '',
  phone: null,
  totalItemQuantity: 35,
  totalPrice: 175,
};

export const eastWarehouse: Warehouse = {
  ...mainWarehouse,
  id: 3,
  name: 'East Warehouse',
  totalItemQuantity: 10,
  totalPrice: 50,
};

export const westWarehouse: Warehouse = {
  ...mainWarehouse,
  id: 4,
  name: 'West Warehouse',
  totalItemQuantity: 15,
  totalPrice: 75,
};

const toStockItem = (
  product: (typeof products)[number],
  quantity: number
): WarehouseStockItem => ({
  productVariant: {
    id: product.id,
    name: product.name,
    sku: product.sku,
    barcode: product.barcode,
  },
  unitOfMeasurement: unit,
  quantity,
  totalPrice: quantity * 5,
});

export const mainWarehouseStock: WarehouseStockItem[] = [
  toStockItem(products[0], 10),
  toStockItem(products[1], 15),
  toStockItem(products[2], 10),
];

export const eastWarehouseStock: WarehouseStockItem[] = [
  toStockItem(products[1], 10),
  toStockItem(products[2], 8),
];

export const draftTransfer: TransferDetails = {
  dispatchedAt: null,
  dispatchedBy: null,
  completedAt: null,
  completedBy: null,
  createdAt: '2026-10-28T10:00:00Z',
  createdBy: 'owner@example.test',
  updatedAt: '2026-10-28T10:00:00Z',
  updatedBy: 'owner@example.test',
  id: 9,
  version: 1,
  status: 'DRAFT',
  transferNumber: 'TR-009',
  comment: 'Original saved comment',
  sourceWarehouse: {
    id: mainWarehouse.id,
    name: mainWarehouse.name,
    status: mainWarehouse.status,
  },
  destinationWarehouse: {
    id: eastWarehouse.id,
    name: eastWarehouse.name,
    status: eastWarehouse.status,
  },
  transferEntries: [
    {
      id: 17,
      productVariant: {
        id: 11,
        name: 'Rice',
        sku: 'RICE',
        barcode: '',
      },
      unitOfMeasurement: unit,
      quantity: 2,
      comment: null,
    },
  ],
};

type TransferFixtures = {
  savedTransfer: {
    replace: (changes: Partial<TransferDetails>) => Promise<TransferDetails>;
    failReads: (fail: boolean) => Promise<void>;
  };
  capture: (name: string) => Promise<void>;
};

export const test = base.extend<TransferFixtures>({
  savedTransfer: [
    async ({ context, request, baseURL }, use) => {
      const token = `transfer-e2e-${randomUUID()}`;
      const endpoint = `${backendURL}/__test/sessions/${token}`;
      const initialResponse = await request.put(endpoint, {
        data: {
          saved: draftSupply,
          savedTransfer: draftTransfer,
          products,
          unit,
          warehouses: [mainWarehouse, eastWarehouse, westWarehouse],
          warehouseStock: mainWarehouseStock,
          warehouseStockById: {
            [mainWarehouse.id]: mainWarehouseStock,
            [eastWarehouse.id]: eastWarehouseStock,
          },
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
          const savedTransfer: TransferDetails = {
            ...session.savedTransfer,
            version: session.savedTransfer.version + 1,
            ...changes,
          };
          const update = await request.put(endpoint, {
            data: { ...session, savedTransfer },
          });
          expect(update.ok()).toBeTruthy();
          return savedTransfer;
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
  await test.step('Simulate returning to the tab and wait for the saved transfer request', async () => {
    const refreshed = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === transferApiPath &&
        response.request().method() === 'GET'
    );
    await page.bringToFront();
    await page.evaluate(() => {
      document.dispatchEvent(new Event('visibilitychange', { bubbles: true }));
    });
    await refreshed;
  });
};
