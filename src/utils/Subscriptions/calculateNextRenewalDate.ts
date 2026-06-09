/**
 * Calculates the next renewal date based on the billing cycle anchor (5th of the month).
 *
 * @param anchorDay - The day of the month for billing (default: 5)
 * @returns ISO string of the next renewal date
 *
 * @example
 * // If today is June 3rd
 * calculateNextRenewalDate() // Returns June 5th
 *
 * // If today is June 6th
 * calculateNextRenewalDate() // Returns July 5th
 */
export const calculateNextRenewalDate = (anchorDay: number = 5): string => {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Create a date for the anchor day of the current month
  const nextRenewalDate = new Date(currentYear, currentMonth, anchorDay);

  // If we've already passed the anchor day this month, use the anchor day of next month
  if (currentDay >= anchorDay) {
    nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);
  }

  return nextRenewalDate.toISOString();
};
