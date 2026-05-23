export interface RewardAccount {
  id: string;
  created_at: string;
  user_id: string;
  balance: number | null;
  lifetime_earned: number | null;
  lifetime_redeemed: number | null;
  updated_at: string | null;
}

export interface RewardTransaction {
  id: string;
  created_at: string;
  reward_account_id: string;
  type: string;
  amount: number;
  source: string;
  reference_id: string | null;
  description: string | null;
  expires_at: string | null;
}

export type UserRewardsActionsAndAccount = UserRewardActions & {
  reward_actions: {
    id: string;
    key: RewardActionKey;
  };
  reward_accounts: RewardAccount[];
};

export type RewardsTransactionInsert = Omit<
  RewardTransaction,
  "id" | "created_at"
>;

export interface UserRewardActions {
  id: string;
  completed_at: string;
  user_id: string;
  reward_action_id: string;
  progress: number | null;
  metadata: Record<string, string | number> | null;
}
export enum RewardActionKey {
  SIGNUP = "signup",
  VERIFY_EMAIL = "verify_email",
  ADD_PHONE = "add_phone",
  ADD_BIRTHDAY = "add_birthday",
  COMPLETE_PROFILE = "complete_profile",

  FIRST_FAVORITE = "first_favorite",
  FIRST_CART_ADD = "first_cart_add",
  FIRST_ORDER = "first_order",
  SECOND_ORDER = "second_order",

  WRITE_REVIEW = "write_review",
  UPLOAD_REVIEW_PHOTO = "upload_review_photo",

  SUBSCRIBE_EMAIL = "subscribe_email",
  SUBSCRIBE_SMS = "subscribe_sms",

  REFER_FRIEND = "refer_friend",
  REFERRAL_PURCHASE = "referral_purchase",

  BIRTHDAY_REWARD = "birthday_reward",

  FOLLOW_INSTAGRAM = "follow_instagram",
  SHARE_PRODUCT = "share_product",

  ORDER_STREAK_3 = "order_streak_3",
  SPEND_THRESHOLD_100 = "spend_threshold_100",
  MAKE_RESERVATION = "make_reservation",
}

export const REWARD_ACTIONS = {
  [RewardActionKey.SIGNUP]: {
    title: "Create Account",
    reward: 100,
  },

  [RewardActionKey.VERIFY_EMAIL]: {
    title: "Verify Email",
    reward: 50,
  },

  [RewardActionKey.ADD_PHONE]: {
    title: "Add Phone Number",
    reward: 25,
  },

  [RewardActionKey.ADD_BIRTHDAY]: {
    title: "Add Birthday",
    reward: 50,
  },

  [RewardActionKey.COMPLETE_PROFILE]: {
    title: "Complete Profile",
    reward: 100,
  },

  [RewardActionKey.FIRST_FAVORITE]: {
    title: "Save Your First Favorite",
    reward: 15,
  },

  [RewardActionKey.FIRST_CART_ADD]: {
    title: "Add Your First Item To Cart",
    reward: 10,
  },

  [RewardActionKey.FIRST_ORDER]: {
    title: "Place Your First Order",
    reward: 250,
  },

  [RewardActionKey.SECOND_ORDER]: {
    title: "Place Your Second Order",
    reward: 150,
  },

  [RewardActionKey.WRITE_REVIEW]: {
    title: "Write A Review",
    reward: 50,
  },

  [RewardActionKey.UPLOAD_REVIEW_PHOTO]: {
    title: "Upload A Review Photo",
    reward: 75,
  },

  [RewardActionKey.SUBSCRIBE_EMAIL]: {
    title: "Join Email Updates",
    reward: 25,
  },

  [RewardActionKey.SUBSCRIBE_SMS]: {
    title: "Join SMS Updates",
    reward: 50,
  },

  [RewardActionKey.REFER_FRIEND]: {
    title: "Refer A Friend",
    reward: 500,
  },

  [RewardActionKey.REFERRAL_PURCHASE]: {
    title: "Referral Completed Purchase",
    reward: 250,
  },

  [RewardActionKey.BIRTHDAY_REWARD]: {
    title: "Birthday Reward",
    reward: 100,
  },

  [RewardActionKey.FOLLOW_INSTAGRAM]: {
    title: "Follow Us On Instagram",
    reward: 25,
  },

  [RewardActionKey.SHARE_PRODUCT]: {
    title: "Share A Product",
    reward: 15,
  },

  [RewardActionKey.ORDER_STREAK_3]: {
    title: "3 Order Streak",
    reward: 300,
  },

  [RewardActionKey.SPEND_THRESHOLD_100]: {
    title: "Spend $100",
    reward: 100,
  },

  [RewardActionKey.MAKE_RESERVATION]: {
    title: "Make A Reservation",
    reward: 200,
  },
} as const;
