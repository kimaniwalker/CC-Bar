import { BlockedAvailability } from "@/components/client/Reservations/BlockedAvailability";

/**
 * Get day of week from date string in America/Chicago timezone
 * @param dateString 'YYYY-MM-DD'
 * @returns 0-6 (0 = Sunday, 6 = Saturday)
 */
function getDayOfWeek(dateString: string): number {
  // Parse date components to avoid timezone issues
  const [year, month, day] = dateString.split("-").map(Number);

  // Create date in local timezone (not UTC)
  const date = new Date(year, month - 1, day);

  return date.getDay();
}

/**
 * Convert ISO timestamp to local time in HH:mm:ss format
 * Handles: "2026-08-09T17:00:00+00:00" -> "12:00:00" (in America/Chicago)
 */
function normalizeTime(time: string): string {
  // If it's a full ISO timestamp, parse and convert to Chicago time
  if (time.includes("T") || time.includes("Z")) {
    const date = new Date(time);

    // Convert to America/Chicago timezone
    const chicagoTime = date.toLocaleString("en-US", {
      timeZone: "America/Chicago",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    return chicagoTime;
  }

  // Already in HH:mm:ss format, just clean it
  const cleanTime = time.split(".")[0].split("+")[0].split("Z")[0];
  const parts = cleanTime.split(":");

  if (parts.length === 2) {
    return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}:00`;
  }
  if (parts.length === 3) {
    return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}:${parts[2].padStart(2, "0")}`;
  }

  return cleanTime;
}

/**
 * Check if a specific date/time is blocked
 */
export function isBlocked(
  date: string, // 'YYYY-MM-DD'
  time: string, // ISO timestamp like '2026-08-09T17:00:00+00:00'
  blockedList: BlockedAvailability[],
): boolean {
  const dayOfWeek = getDayOfWeek(date); // ✅ Use fixed function
  const normalizedTime = normalizeTime(time);

  for (const block of blockedList) {
    // Full day block
    if (block.type === "date" && block.date === date) {
      return true;
    }

    // Date range block
    if (block.type === "dateRange" && block.startDate && block.endDate) {
      if (date >= block.startDate && date <= block.endDate) {
        return true;
      }
    }

    // Specific datetime block
    if (block.type === "datetime" && block.datetime) {
      const [blockDate, blockTime] = block.datetime.split(" ");
      const normalizedBlockTime = normalizeTime(blockTime);

      if (blockDate === date && normalizedBlockTime === normalizedTime) {
        return true;
      }
    }

    // Recurring weekly block (entire day - e.g., all Sundays)
    if (
      block.type === "time" &&
      block.dayOfWeek === dayOfWeek &&
      !block.time &&
      !block.beforeTime
    ) {
      return true;
    }

    // Recurring weekly time block (e.g., every Monday at 10am)
    if (block.type === "time" && block.dayOfWeek === dayOfWeek && block.time) {
      const normalizedBlockTime = normalizeTime(block.time);

      if (normalizedBlockTime === normalizedTime) {
        return true;
      }
    }

    // Recurring weekly "before time" block (e.g., Mon–Thu before 5 PM)
    if (
      block.type === "time" &&
      block.dayOfWeek === dayOfWeek &&
      block.beforeTime
    ) {
      const normalizedBeforeTime = normalizeTime(block.beforeTime);

      if (normalizedTime < normalizedBeforeTime) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if an entire date is blocked (no times available)
 */
export function isDateBlocked(
  date: string,
  blockedList: BlockedAvailability[],
): boolean {
  const dayOfWeek = getDayOfWeek(date); // ✅ Use fixed function

  for (const block of blockedList) {
    // Full day block
    if (block.type === "date" && block.date === date) {
      return true;
    }

    // Date range block
    if (block.type === "dateRange" && block.startDate && block.endDate) {
      if (date >= block.startDate && date <= block.endDate) {
        return true;
      }
    }

    // Recurring weekly block (entire day)
    if (
      block.type === "time" &&
      block.dayOfWeek === dayOfWeek &&
      !block.time &&
      !block.beforeTime
    ) {
      return true;
    }
  }

  return false;
}
