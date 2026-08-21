import type { ATTRIBUTE_STATUS, ATTRIBUTE_VALUE_STATUS } from './constants';

export type AttributeStatus =
  (typeof ATTRIBUTE_STATUS)[keyof typeof ATTRIBUTE_STATUS];

export type AttributeValueStatus =
  (typeof ATTRIBUTE_VALUE_STATUS)[keyof typeof ATTRIBUTE_VALUE_STATUS];

export type Attribute = {
  id: number;
  name: string;
  sortOrder: number;
  status?: AttributeStatus;
  values?: string[];
  createdAt: string;
};

export type AttributeValue = {
  id: number;
  name: string;
  sortOrder: number;
  status?: AttributeValueStatus;
  createdAt: string;
};
