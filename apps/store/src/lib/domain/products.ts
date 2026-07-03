export type ProductCategory = {
  id: number;
  name: string;
  createdAt: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  category: ProductCategory;
};
