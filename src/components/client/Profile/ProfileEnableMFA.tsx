import { Text } from "@/components/ds/Text";
import { BadgeCoin } from "../Rewards/BadgeCoin";
import {
  REWARD_ACTIONS,
  RewardActionKey,
  UserRewardsActionsAndAccount,
} from "@/types/Rewards";

import getUserRewardActions from "@/utils/Rewards/gerUserRewardActions";
import { MFAActionButton } from "./MFAActionButton";

export const ProfileEnableMFA = async ({
  action_key,
  user_id,
  hasPhoneAndEmail,
}: {
  action_key: RewardActionKey;
  user_id: string | null;
  hasPhoneAndEmail: boolean;
}) => {
  if (!user_id || hasPhoneAndEmail) return null; // Don't render if user is not logged in
  const data = await getUserRewardActions({ user_id });

  const rewardsAction = data.find(
    (item: UserRewardsActionsAndAccount) =>
      item.reward_actions.key === action_key,
  );

  const hasBeenCompleted = rewardsAction?.reward_actions.key === action_key;

  return (
    <div className="mt-12 rounded-3xl border border-neutral-200 bg-[#F8F5F1] p-5 relative">
      {!hasBeenCompleted && (
        <BadgeCoin
          worth={REWARD_ACTIONS[RewardActionKey.ADD_PHONE].reward}
          className="absolute -top-4 -right-4"
          action_key={RewardActionKey.ADD_PHONE}
          user_id={user_id}
        />
      )}

      <Text size="lg" className="text-sm font-medium text-neutral-900">
        Get text alerts
      </Text>

      <Text size="sm" className="mt-2 text-sm leading-6 text-neutral-500">
        Add your phone number for faster sign in and order updates.
      </Text>

      <MFAActionButton />
    </div>
  );
};
