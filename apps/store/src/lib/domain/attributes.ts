export type Attribute = {
  id: number;
  name: string;
  sortOrder: number;
  values?: string[];
  createdAt: string;
};

export type AttributeValue = Pick<
  Attribute,
  'id' | 'name' | 'sortOrder' | 'createdAt'
>;
