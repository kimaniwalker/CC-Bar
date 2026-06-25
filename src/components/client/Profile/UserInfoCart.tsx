"use client";

import { Text } from "@/components/ds/Text";
import { useUser } from "../Auth/AuthContext";
import { useEffect, useState } from "react";
import { getProfile } from "@/utils/User/getProfile";
import { UserProfile } from "@/types/User";
import { User, Mail, Phone, MapPin, Edit } from "lucide-react";
import { useModal } from "../ModalContext";
import { AddressCollectorModal } from "../Pos/AddressCollectorModal";

export const UserInfoCard = () => {
  const { user } = useUser();
  const { open } = useModal();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;

      setLoading(true);
      try {
        const data = await getProfile(user.id);
        setProfile(data[0] || null);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user?.id]);

  const handleOpenAddressModal = () => {
    open(
      <AddressCollectorModal
        user_id={user?.id}
        heading="Update Your Information"
        onSave={(updatedProfile) => {
          setProfile(updatedProfile);
        }}
      />,
      {
        maxWidth: "2xl",
        padding: "md",
      },
    );
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-32 animate-pulse rounded bg-neutral-200" />
          <div className="h-10 w-10 animate-pulse rounded-full bg-neutral-200" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
              <div className="h-5 w-full animate-pulse rounded bg-neutral-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
            <User className="h-5 w-5 text-white" />
          </div>
          <Text size="lg" className="font-semibold">
            Personal Information
          </Text>
        </div>

        <button
          onClick={handleOpenAddressModal}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 transition hover:bg-neutral-200"
        >
          <Edit className="h-4 w-4 text-neutral-700" />
        </button>
      </div>

      {/* Info Grid */}
      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
            <Text size="lg" className="font-semibold text-xs text-black">
              Full Name
            </Text>
          </label>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-neutral-400" />
            <Text size="sm" className="font-medium">
              {profile?.first_name && profile?.last_name
                ? `${profile.first_name} ${profile.last_name}`
                : "Not set"}
            </Text>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
            <Text size="lg" className="font-semibold text-xs text-black">
              Email Address
            </Text>
          </label>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-neutral-400" />
            <Text size="sm" className="font-medium">
              {profile?.email || user?.email || "Not set"}
            </Text>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
            <Text size="lg" className="font-semibold text-xs text-black">
              Phone Number
            </Text>
          </label>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-neutral-400" />
            <Text size="sm" className="font-medium">
              {profile?.phone || "Not set"}
            </Text>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
            <Text size="lg" className="font-semibold text-xs text-black">
              Shipping Address
            </Text>
          </label>
          {profile?.shipping_address ? (
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
              <div className="text-sm leading-relaxed text-neutral-700">
                <Text size="sm" className="font-medium text-neutral-900">
                  {profile.shipping_address.address_1}
                </Text>
                {profile.shipping_address.address_2 && (
                  <p>{profile.shipping_address.address_2}</p>
                )}
                <Text size="sm">
                  {profile.shipping_address.city},{" "}
                  {profile.shipping_address.state}{" "}
                  {profile.shipping_address.zip_code}
                </Text>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-neutral-400" />
              <Text size="sm" className="font-medium">
                No address on file
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Update Button */}
      <button
        onClick={handleOpenAddressModal}
        className="mt-6 w-full rounded-2xl bg-black py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
      >
        <Text
          size="sm"
          className="font-semibold flex items-center justify-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Update Information
        </Text>
      </button>
    </div>
  );
};
