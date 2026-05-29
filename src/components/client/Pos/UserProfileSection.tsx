import { Text } from "@/components/ds/Text";
import { UserProfile } from "@/types/User";

interface UserProfileSectionProps {
  profileLoading: boolean;
  userProfile: UserProfile | null;
  user_id: string;
  onOpenAddressCollector: () => void;
}

export const UserProfileSection = ({
  profileLoading,
  userProfile,
  user_id,
  onOpenAddressCollector,
}: UserProfileSectionProps) => {
  if (profileLoading) {
    return (
      <div className="mt-2 flex flex-col gap-2">
        <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
        <div className="mt-4 h-10 w-full animate-pulse rounded-2xl bg-neutral-200" />
      </div>
    );
  }

  return (
    <>
      <Text size="sm" className="mt-2">
        Customer -{" "}
        {userProfile
          ? `${userProfile.first_name} ${userProfile.last_name}`
          : user_id}
      </Text>

      <div className="mt-4">
        <button
          onClick={onOpenAddressCollector}
          className={`w-full rounded-2xl px-4 py-2 text-sm font-medium transition ${
            userProfile?.shipping_address
              ? "bg-green-50 text-green-700 hover:bg-green-100"
              : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          }`}
        >
          {userProfile?.shipping_address
            ? "✓ Address verified"
            : "⚠ Add shipping address"}
        </button>
      </div>
    </>
  );
};
