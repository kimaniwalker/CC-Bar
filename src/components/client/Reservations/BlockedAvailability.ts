export type BlockedAvailability = {
  type: "date" | "time" | "datetime" | "dateRange";
  date?: string; // 'YYYY-MM-DD'
  time?: string; // 'HH:mm:ss' in America/Chicago timezone
  datetime?: string; // 'YYYY-MM-DD HH:mm:ss' in America/Chicago timezone
  startDate?: string; // For range blocks
  endDate?: string;
  dayOfWeek?: number; // 0-6 (0 = Sunday, 6 = Saturday)
  reason?: string;
};

export const BLOCKED_AVAILABILITY: BlockedAvailability[] = [
  // Full day blocks
  { type: "date", date: "2026-08-22", reason: "Vacation" },
  { type: "date", date: "2026-08-15", reason: "Personal Day" },
  { type: "date", date: "2026-09-29", reason: "Lanier Private Bday Booking" },

  // Date range blocks (vacation week)
  {
    type: "dateRange",
    startDate: "2026-08-01",
    endDate: "2026-08-07",
    reason: "Summer break",
  },

  // Specific datetime blocks - Use LOCAL Chicago times (12:00 PM, not 17:00 UTC)
  {
    type: "datetime",
    datetime: "2026-08-12 14:00:00",
    reason: "Doctor appointment",
  },

  // Block all Sundays (dayOfWeek 0 = Sunday)
  { type: "time", dayOfWeek: 0, reason: "Closed Sundays" },

  // Block 1:00 PM every Monday - Use LOCAL Chicago time
  { type: "time", dayOfWeek: 1, time: "13:00:00", reason: "Staff meeting" },

  // Block 12:00 PM every Saturday
  { type: "time", dayOfWeek: 6, time: "12:00:00", reason: "Lunch break" },
];
