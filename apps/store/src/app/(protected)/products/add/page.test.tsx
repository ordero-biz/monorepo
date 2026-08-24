import { render, screen } from '@testing-library/react';
import AddProductPage from './page';

vi.mock('@/features/products', async () => ({
  ...(await vi.importActual<typeof import('@/features/products')>(
    '@/features/products'
  )),
  CreateProduct: () => <h1>Product template</h1>,
}));

describe('AddProductPage', () => {
  it('renders the create product workflow', () => {
    render(<AddProductPage />);

    expect(
      screen.getByRole('heading', { name: 'Product template' })
    ).toBeVisible();
  });
});
