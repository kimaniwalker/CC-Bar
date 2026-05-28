export interface UserProfile {
  customer_id?: string;
  email?: string;
  id: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  ustomer_id?: string;
  created_at?: string;
  updated_at?: string;
  shipping_address?: Record<string, string>;
}

export enum PROFILE_SECTIONS {
  OVERVIEW = "overview",
  ORDERS = "orders",
  FAVORITES = "favorites",
  SETTINGS = "settings",
  PROFILE = "profile",
}
