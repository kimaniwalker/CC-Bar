import { ProfileEnableMFA } from "./ProfileEnableMFA";
import { RewardActionKey } from "@/types/Rewards";
import { getUser } from "@/utils/User/getUser";
import { ProfileSideBarContent } from "./ProfileSideBarContent";

export const ProfileSideBar = async () => {
  const user = await getUser();
  const hasPhoneAndEmail = Boolean(user?.phone) && Boolean(user?.email);
  return (
    <>
      <ProfileSideBarContent
        mfaContent={
          <ProfileEnableMFA
            action_key={RewardActionKey.ADD_PHONE}
            user_id={user?.id ?? null}
            hasPhoneAndEmail={hasPhoneAndEmail}
          />
        }
      />
    </>
  );
};
