import { Text } from "@/components/ds/Text";
import { RewardActionKey } from "@/types/Rewards";
import { ProfileEnableMFA } from "./ProfileEnableMFA";
import { getUser } from "@/utils/User/getUser";

export const ProfileSection = async () => {
  const user = await getUser();
  const hasPhoneAndEmail = Boolean(user?.phone) && Boolean(user?.email);
  return (
    <div className="flex-1">
      <Text size="lg" className="mb-2 text-2xl font-semibold">
        Profile
      </Text>
      <Text size="sm" className="text-gray-600">
        Manage your profile information, settings, and preferences.
      </Text>
      <div className="md:hidden">
        <ProfileEnableMFA
          action_key={RewardActionKey.ADD_PHONE}
          user_id={user?.id ?? null}
          hasPhoneAndEmail={hasPhoneAndEmail}
        />
      </div>
    </div>
  );
};
