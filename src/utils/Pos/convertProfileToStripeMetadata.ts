import { UserProfile } from "@/types/User";

export function convertProfileToStripeMetadata(
  profile: UserProfile | undefined,
): Record<string, string> {
  if (!profile) return {};

  const metadata: Record<string, string> = {};

  // Add top-level profile fields
  if (profile.id) metadata.user_id = profile.id;
  if (profile.customer_id) metadata.customer_id = profile.customer_id;
  if (profile.email) metadata.email = profile.email;
  if (profile.phone) metadata.phone = profile.phone;
  if (profile.first_name) metadata.first_name = profile.first_name;
  if (profile.last_name) metadata.last_name = profile.last_name;
  if (profile.created_at) metadata.created_at = profile.created_at;
  if (profile.updated_at) metadata.updated_at = profile.updated_at;

  // Add shipping address fields with prefix
  if (profile.shipping_address) {
    Object.entries(profile.shipping_address).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        metadata[`shipping_${key}`] = String(value);
      }
    });
  }

  return metadata;
}
