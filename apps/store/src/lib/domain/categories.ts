export type CategoryParent = {
  id: number;
  name: string;
  createdAt: string;
};

export type Category = {
  id: number;
  name: string;
  sortOrder: number;
  color: string;
  createdAt: string;
  parentCategory?: CategoryParent | null;
};
