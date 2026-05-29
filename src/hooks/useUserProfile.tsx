import { useState, useEffect } from "react";
import { UserProfile } from "@/types/User";
import { getProfile } from "@/utils/User/getProfile";

export const useUserProfile = (user_id: string | null) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    async function loadUserProfile() {
      if (!user_id) return;

      setProfileLoading(true);
      try {
        const data = await getProfile(user_id);
        setUserProfile(data[0] || null);
      } catch (error) {
        console.error("Failed to load user profile:", error);
      } finally {
        setProfileLoading(false);
      }
    }

    loadUserProfile();
  }, [user_id]);

  return { userProfile, profileLoading, setUserProfile };
};
