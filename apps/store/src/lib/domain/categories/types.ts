import type { CATEGORY_STATUS } from './constants';

export type CategoryStatus =
  (typeof CATEGORY_STATUS)[keyof typeof CATEGORY_STATUS];

export type CategoryParent = {
  id: number;
  name: string;
  status?: CategoryStatus;
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
