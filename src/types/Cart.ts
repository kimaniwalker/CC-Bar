import { CartProduct } from "./Product";

export type Cart = CartProduct[];

export type ShippingMethod = "delivery" | "pickup";

export type ShippingRate = {
  serviceCode: string;
  serviceName: string;
  shipmentCost: number;
  otherCost: number;
  transitDays: number | null;
};
