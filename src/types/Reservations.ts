export type Timeslot = {
  label: string; // e.g. "10:00 AM"
  value: string; // e.g. "2026-04-28T22:00:00+00:00"
  total_guests: number; // Total guests booked for this timeslot
};

export type ReservationsFormInputs = {
  name: string;
  email: string;
  date: string;
  time: string;
  dateTime: string;
  guests: number;
  activities: string[];
  addOns: string[];
  phone: string;
  special_requests?: string;
};

export enum CheckoutType {
  RESERVATION = "reservation",
  SHOP = "shop",
  IN_STORE = "in_store",
  SUBSCRIPTION = "subscription",
}
