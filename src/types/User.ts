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
  shipping_address?: {
    city: string;
    state: string;
    zip_code: string;
    address_1: string;
    address_2: string;
  };
}

export enum PROFILE_SECTIONS {
  OVERVIEW = "overview",
  ORDERS = "orders",
  FAVORITES = "favorites",
  SETTINGS = "settings",
  PROFILE = "profile",
}

export type Subscription = {
  id: string;
  user_id: string;
  status: string;
  subscription_id: string;
  next_renewal: string;
  created_at: string;
  updated_at: string;
  cancel_at: string | null;
  pause_scheduled_at: string | null;
};

export type SubscriptionInsert = {
  user_id?: string;
  status: string;
  subscription_id: string;
  next_renewal?: string | null;
  created_at?: string;
  updated_at: string;
  cancel_at?: string | null;
  pause_scheduled_at?: string | null;
};
