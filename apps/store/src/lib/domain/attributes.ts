export type Attribute = {
  id: number;
  name: string;
  sortOrder: number;
  values?: string[];
  createdAt: string;
};

export type AttributeValue = {
  id: number;
  name: string;
  sortOrder: number;
  createdAt: string;
};

export type AttributeDropdown = Attribute & {
  attributeValues: AttributeValue[];
};
