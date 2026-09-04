import { CreateProduct } from '@/features/products';

export default function AddProductPage() {
  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <CreateProduct />
    </div>
  );
}
