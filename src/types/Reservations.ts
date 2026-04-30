export type Timeslot = {
    label: string; // e.g. "10:00 AM"
    value: string; // e.g. "2026-04-28T22:00:00+00:00"
  };

  export type ReservationsFormInputs = {
    name: string
    email: string
    date: string
    time: string
    dateTime: string
    guests: number
    activities: string[]
    phone: string
    special_requests?: string
  }

  export enum CheckoutType {
    RESERVATION = "reservation",
    PRODUCT = "Product Purchase"
  }