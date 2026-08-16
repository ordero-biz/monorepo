export type CategoryParent = {
  id: number;
  name: string;
  createdAt: string;
};

export type Category = {
  id: number;
  name: string;
  sortOrder: number;
  status?: CategoryStatus;
  createdAt: string;
  parentCategory?: CategoryParent | null;
};
export const CATEGORY_STATUS = {
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
} as const;

export type CategoryStatus =
  (typeof CATEGORY_STATUS)[keyof typeof CATEGORY_STATUS];
