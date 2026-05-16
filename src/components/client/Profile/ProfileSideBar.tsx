

import { ProfileEnableMFA } from "./ProfileEnableMFA"
import { RewardActionKey } from "@/types/Rewards"
import { getUser } from "@/utils/server/getUser"
import { ProfileSideBarContent } from "./ProfileSideBarContent"


export const ProfileSideBar = async () => {
  const user = await getUser()
  return (<>
    <ProfileSideBarContent mfaContent={
      <ProfileEnableMFA action_key={RewardActionKey.BIRTHDAY_REWARD} user_id={user?.id ?? null} />
    } />

  </>

  )
}