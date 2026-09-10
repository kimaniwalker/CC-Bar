export type BlockedAvailability = {
  type: "date" | "time" | "datetime" | "dateRange";
  date?: string; // 'YYYY-MM-DD'
  time?: string; // 'HH:mm:ss' in America/Chicago timezone
  beforeTime?: string; // block all slots strictly before this time 'HH:mm:ss'
  datetime?: string; // 'YYYY-MM-DD HH:mm:ss' in America/Chicago timezone
  startDate?: string; // For range blocks
  endDate?: string;
  dayOfWeek?: number; // 0-6 (0 = Sunday, 6 = Saturday)
  reason?: string;
};

export const BLOCKED_AVAILABILITY: BlockedAvailability[] = [
  // Full day blocks
  {
    type: "dateRange",
    startDate: "2026-11-06",
    endDate: "2026-11-14",
    reason: "Traveling",
  },

  // Block all Sundays (dayOfWeek 0 = Sunday)
  { type: "time", dayOfWeek: 0, reason: "Closed Sundays" },

  // Block Mon–Thu before 5 PM
  {
    type: "time",
    dayOfWeek: 1,
    beforeTime: "17:00:00",
    reason: "Unavailable before 5 PM",
  },
  {
    type: "time",
    dayOfWeek: 2,
    beforeTime: "17:00:00",
    reason: "Unavailable before 5 PM",
  },
  {
    type: "time",
    dayOfWeek: 3,
    beforeTime: "17:00:00",
    reason: "Unavailable before 5 PM",
  },
  {
    type: "time",
    dayOfWeek: 4,
    beforeTime: "17:00:00",
    reason: "Unavailable before 5 PM",
  },
];
