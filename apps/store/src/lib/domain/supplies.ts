type SupplyParty = {
  id: number;
  name: string;
};

export type Supply = {
  id: number;
  supplier: SupplyParty;
  warehouse: SupplyParty;
  status: string;
  comment: string | null;
  completedAt: string | null;
  completedBy: string | null;
  supplyNumber: string;
  supplierInvoiceNumber: string | null;
  totalQuantity: number;
  totalPrice: number;
  createdAt: string;
};
