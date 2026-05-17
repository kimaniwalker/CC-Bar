import { createClient } from "../Supabase/server"

export const rewardEngine = {
   async completeAction({
      userId,
      actionKey,
   }:{
      userId: string,
      actionKey: string
   }) {
      const supabase = await createClient()
      return supabase.rpc(
         "complete_reward_action",
         {
            p_user_id: userId,
            p_action_key: actionKey,
         }
      )
   },
   async redeem() {},
   async getBalance() {},
   async getProgress() {},
}