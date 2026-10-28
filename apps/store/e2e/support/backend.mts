import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http';
import type { CreateSupplyData } from '../../src/lib/client/api/supplies/index';
import type { Category } from '../../src/lib/domain/categories/types';
import type { ProductVariant } from '../../src/lib/domain/products/types';
import type { SupplyDetails } from '../../src/lib/domain/supplies/types';

// Test-only backend. Each browser context has its own token and saved record,
// including SSR requests, so tests can run independently and in parallel.
type Session = {
  categories?: Category[];
  saved: SupplyDetails;
  products: ProductVariant[];
  unit: SupplyDetails['supplyEntries'][number]['unitOfMeasurement'];
  readError?: boolean;
};
const sessions = new Map<string, Session>();

const readJson = async <T,>(request: IncomingMessage): Promise<T> => {
  let body = '';
  for await (const chunk of request) body += chunk;
  return JSON.parse(body);
};
const respond = ({
  response,
  status = 200,
  body,
}: {
  response: ServerResponse;
  status?: number;
  body: unknown;
}) => {
  response.writeHead(status, { 'content-type': 'application/json' });
  response.end(JSON.stringify(body));
};
const paginate = (content: unknown[]) => ({
  content,
  page: { size: 100, number: 1, totalElements: content.length, totalPages: 1 },
});

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1');
    const path = url.pathname;
    if (path === '/health') {
      respond({ response, body: { ready: true } });
      return;
    }
    const sessionId = path.match(/^\/__test\/sessions\/([^/]+)$/)?.[1];
    if (sessionId) {
      if (request.method === 'PUT') {
        sessions.set(sessionId, await readJson<Session>(request));
      } else if (request.method === 'DELETE') {
        sessions.delete(sessionId);
      }
      respond({ response, body: sessions.get(sessionId) ?? null });
      return;
    }

    const token = request.headers.authorization?.replace(/^Bearer /, '');
    const session = token ? sessions.get(token) : undefined;
    if (!session) {
      respond({
        response,
        status: 401,
        body: { message: 'Unknown test session.' },
      });
      return;
    }
    if (path === '/api/v1/employees/me') {
      respond({
        response,
        body: {
          id: 'test-user',
          name: 'Supply reviewer',
          email: 'reviewer@example.test',
        },
      });
      return;
    }
    if (path === '/api/v1/categories' && session.categories) {
      if (request.method === 'GET') {
        const page = Number(url.searchParams.get('page') ?? 0);
        const size = Number(url.searchParams.get('size') ?? 10);
        respond({
          response,
          body: {
            content: session.categories.slice(page * size, (page + 1) * size),
            page: {
              number: page,
              size,
              totalElements: session.categories.length,
              totalPages: Math.ceil(session.categories.length / size),
            },
          },
        });
        return;
      }
      if (request.method === 'DELETE') {
        const { categoryIds } = await readJson<{ categoryIds: number[] }>(
          request
        );
        session.categories = session.categories.filter(
          (category) => !categoryIds.includes(category.id)
        );
        response.writeHead(204);
        response.end();
        return;
      }
    }
    const saved = session.saved;
    const isDetail = path === `/api/v1/supplies/${saved.id}`;
    if (isDetail && request.method === 'GET') {
      respond({
        response,
        status: session.readError ? 503 : 200,
        body: session.readError ? { message: 'Temporary test outage.' } : saved,
      });
      return;
    }
    if (
      (isDetail && request.method === 'PATCH') ||
      (path === '/api/v1/supplies' && request.method === 'POST')
    ) {
      const input = await readJson<
        Partial<CreateSupplyData> & { expectedVersion?: number }
      >(request);
      if (
        request.method === 'PATCH' &&
        (input.expectedVersion !== saved.version ||
          saved.status === 'COMPLETED')
      ) {
        respond({
          response,
          status: 409,
          body: { message: 'This supply was changed by another user.' },
        });
        return;
      }
      const {
        expectedVersion: _version,
        supplyEntries,
        supplierId: _supplierId,
        warehouseId: _warehouseId,
        ...fields
      } = input;
      const entries =
        supplyEntries?.map((entry, index) => {
          const product = session.products.find(
            ({ id }) => id === entry.productVariantId
          );
          if (!product)
            throw new Error(`Unknown test product ${entry.productVariantId}`);
          return {
            id: saved.version * 100 + index,
            productVariant: {
              id: product.id,
              name: product.name,
              sku: product.sku,
            },
            unitOfMeasurement: session.unit,
            quantity: entry.quantity,
            unitPrice: entry.unitPrice,
            comment: entry.comment,
          };
        }) ?? (request.method === 'POST' ? [] : saved.supplyEntries);
      session.saved = {
        ...saved,
        ...(request.method === 'POST'
          ? { comment: null, supplierInvoiceNumber: null }
          : {}),
        ...fields,
        supplyEntries: entries,
        totalQuantity: entries.reduce((sum, entry) => sum + entry.quantity, 0),
        totalPrice: entries.reduce(
          (sum, entry) => sum + entry.quantity * entry.unitPrice,
          0
        ),
        version: request.method === 'POST' ? 1 : saved.version + 1,
      };
      respond({ response, body: session.saved });
      return;
    }
    const lists: Record<string, unknown[]> = {
      '/api/v1/supplies': [saved],
      '/api/v1/suppliers': [saved.supplier],
      '/api/v1/warehouses': [saved.warehouse],
      '/api/v1/products/variants': session.products,
      '/api/v1/units-of-measurement': [session.unit],
    };
    if (request.method === 'GET' && lists[path]) {
      respond({ response, body: paginate(lists[path]) });
      return;
    }
    respond({
      response,
      status: 404,
      body: {
        message: `Unconfigured test endpoint: ${request.method} ${path}`,
      },
    });
  } catch (error) {
    respond({ response, status: 500, body: { message: String(error) } });
  }
});

server.listen(3101, '127.0.0.1');
