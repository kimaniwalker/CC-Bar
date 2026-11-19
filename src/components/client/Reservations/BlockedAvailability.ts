export type BlockedAvailability = {
  type: "date" | "time" | "datetime" | "dateRange" | "timeRange";
  date?: string; // 'YYYY-MM-DD'
  time?: string; // 'HH:mm:ss' in America/Chicago timezone
  startTime?: string; // Inclusive start of a time range, 'HH:mm:ss'
  endTime?: string; // Exclusive end of a time range, 'HH:mm:ss'
  beforeTime?: string; // block all slots strictly before this time 'HH:mm:ss'
  afterTime?: string; // block all slots at or after this time 'HH:mm:ss'
  datetime?: string; // 'YYYY-MM-DD HH:mm:ss' in America/Chicago timezone
  startDate?: string; // For range blocks
  endDate?: string;
  dayOfWeek?: number; // 0-6 (0 = Sunday, 6 = Saturday)
  reason?: string;
};

export const BLOCKED_AVAILABILITY: BlockedAvailability[] = [
  // Full day blocks

  {
    type: "date",
    date: "2026-12-19",
    reason: "Private Booking",
  },

  {
    type: "timeRange",
    date: "2026-12-17",
    startTime: "17:00:00",
    endTime: "19:00:00",
    reason: "Shemekia Bday",
  },
  {
    type: "timeRange",
    date: "2027-01-08",
    startTime: "12:00:00",
    endTime: "16:00:00",
    reason: "A Collins Law",
  },
  {
    type: "timeRange",
    date: "2027-01-09",
    startTime: "12:00:00",
    endTime: "17:00:00",
    reason: "Jonquil Private Booking",
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
