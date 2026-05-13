export type AttributeRow = {
  createdAt: string;
  id: number;
  name: string;
  sortOrder: number;
};

export type AttributesApiResponse = {
  content: AttributeRow[];
  totalElements: number;
};
