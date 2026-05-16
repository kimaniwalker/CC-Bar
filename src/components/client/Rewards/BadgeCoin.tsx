import { Text } from "@/components/ds/Text";
import { RewardActionKey } from "@/types/Rewards";
import getUserRewardActions from "@/utils/Rewards/gerUserRewardActions";
import { BadgeDollarSign } from "lucide-react";

export const BadgeCoin = ({ className = "", worth, user_id, action_key }: { className?: string; worth: number, user_id: string | null, action_key: RewardActionKey }) => {
  if (!user_id) return null; // Don't render if user is not logged in
  
  const hasCompletedAction = false; 
  if (hasCompletedAction) {
    return null; // Don't render the badge if the action hasn't been completed
  }
  
  return (
    <div className={className}>
    <div
      className="relative inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-500 shadow-md"
      aria-hidden={false}
      role="img"
      aria-label={`Earn ${worth} points`}
    >
      {/* coin surface with icon */}
      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-300 shadow-md">
        <BadgeDollarSign
          className={`h-7 w-7 text-black`}
                  aria-hidden="true"
                  fill="#d6e232"
        />
      </div>

      {/* numeric badge */}
      <div className="absolute -top-1 -right-6 inline-flex items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-semibold px-2 py-0.5 shadow-sm">
        <Text as="span" size="md" className="text-xs">+{worth}</Text>
      </div>

      {/* accessible description */}
      <span className="sr-only">This action earns you {worth} reward points.</span>
    </div>
    </div>
  );
};