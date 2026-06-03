export enum SubscriptionStatus {
  // Active statuses
  ACTIVE = "active",
  TRIALING = "trialing",

  // Incomplete statuses
  INCOMPLETE = "incomplete",
  INCOMPLETE_EXPIRED = "incomplete_expired",

  // Payment issue statuses
  PAST_DUE = "past_due",
  UNPAID = "unpaid",
  CANCELED = "canceled",

  // Ended status
  ENDED = "ended",

  // Special status
  PAUSED = "paused",
}
