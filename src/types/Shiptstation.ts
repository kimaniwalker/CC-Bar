type ShipStationAddress = {
  name: string;
  company?: string | null;
  street1?: string | null;
  street2?: string | null;
  street3?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  phone?: string | null;
  residential?: boolean | null;
};

type ShipStationItem = {
  lineItemKey?: string | null;
  sku: string;
  name: string;
  imageUrl?: string | null;
  weight?: {
    value: number;
    units: "pounds" | "ounces" | "grams";
  };
  quantity: number;
  unitPrice: number;
  taxAmount?: number | null;
  shippingAmount?: number | null;
  warehouseLocation?: string | null;
  options?: Array<{
    name: string;
    value: string;
  }>;
  productId?: number | null;
  fulfillmentSku?: string | null;
  adjustment?: boolean;
  upc?: string | null;
};

export type CreateShipStationOrderParams = {
  orderNumber: string;
  orderKey?: string;
  orderDate: string; // ISO 8601 format
  paymentDate?: string;
  shipByDate?: string;
  orderStatus:
    | "awaiting_payment"
    | "awaiting_shipment"
    | "shipped"
    | "on_hold"
    | "cancelled";
  customerId?: number;
  customerUsername?: string;
  customerEmail: string;
  billTo: ShipStationAddress;
  shipTo: ShipStationAddress;
  items: ShipStationItem[];
  amountPaid: number;
  taxAmount?: number;
  shippingAmount?: number;
  customerNotes?: string;
  internalNotes?: string;
  gift?: boolean;
  giftMessage?: string;
  paymentMethod?: string;
  requestedShippingService?: string;
  carrierCode?: string;
  serviceCode?: string;
  packageCode?: string;
  confirmation?:
    | "none"
    | "delivery"
    | "signature"
    | "adult_signature"
    | "direct_signature";
  shipDate?: string;
  weight?: {
    value: number;
    units: "pounds" | "ounces" | "grams";
  };
  dimensions?: {
    units: "inches" | "centimeters";
    length: number;
    width: number;
    height: number;
  };
  insuranceOptions?: {
    provider: "carrier" | "shipsurance" | "provider";
    insureShipment: boolean;
    insuredValue: number;
  };
  advancedOptions?: {
    warehouseId?: number | null;
    nonMachinable?: boolean;
    saturdayDelivery?: boolean;
    containsAlcohol?: boolean;
    storeId?: number | null;
    customField1?: string | null;
    customField2?: string | null;
    customField3?: string | null;
    source?: string | null;
  };
  tagIds?: number[];
};
