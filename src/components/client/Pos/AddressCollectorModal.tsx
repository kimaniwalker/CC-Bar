"use client";
import { UserProfile } from "@/types/User";
import { getProfile } from "@/utils/User/getProfile";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Building2,
  Home,
  Mail,
  Map,
  MapPin,
  Phone,
  Truck,
  User,
} from "lucide-react";
import { Input } from "@/components/ds/Input";
import { Text } from "@/components/ds/Text";
import { updateUserProfile } from "@/utils/User/updateUserProfile";
import { useModal } from "../ModalContext";

type AddressFormData = {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
};

export const AddressCollectorModal = ({
  user_id,
  heading,
  onSave,
}: {
  user_id?: string;
  heading?: string;
  onSave?: (updatedProfile: UserProfile) => void;
}) => {
  const [_profile, setProfile] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { close } = useModal();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>();

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      const data = await getProfile(user_id ?? "guest");
      setProfile(data);

      // Reset form with fetched data
      if (data[0]) {
        reset({
          first_name: data[0].first_name || "",
          last_name: data[0].last_name || "",
          address_1: data[0].shipping_address?.address_1 || "",
          address_2: data[0].shipping_address?.address_2 || "",
          city: data[0].shipping_address?.city || "",
          state: data[0].shipping_address?.state || "",
          zip_code: data[0].shipping_address?.zip_code || "",
          phone: data[0].phone || "",
        });
      }

      setLoading(false);
    }
    loadProfile();
  }, [user_id, reset]);

  const onSubmit = async (data: AddressFormData) => {
    // Add your update logic here
    const formattedUserData = {
      id: user_id ?? "guest",
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      shipping_address: {
        address_1: data.address_1,
        address_2: data.address_2 || "",
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
      },
    };
    await updateUserProfile({ user: { ...formattedUserData } });
    onSave?.({ ...formattedUserData });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100">
            <MapPin className="h-6 w-6 text-neutral-700" />
          </div>

          <div className="flex flex-col gap-1">
            <Text className="text-xl font-semibold text-neutral-900">
              {heading ? heading : "Shipping Address"}
            </Text>

            <Text size="sm" className="text-sm">
              Enter where you would like your order delivered.
            </Text>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`flex flex-col gap-2 ${i === 2 || i === 3 ? "sm:col-span-2" : ""}`}
            >
              <div className="h-4 w-20 rounded bg-neutral-200 animate-pulse" />
              <div className="h-14 w-full rounded-2xl bg-neutral-200 animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
              First Name
            </label>

            <div className="relative">
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />

              <Input
                hideLabel
                {...register("first_name", {
                  required: "First name is required",
                })}
                placeholder="John"
                className="h-14 w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-12 pr-4 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </div>
            {errors.first_name && (
              <span className="text-xs text-red-500">
                {errors.first_name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
              Last Name
            </label>

            <div className="relative">
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />

              <Input
                hideLabel
                {...register("last_name", {
                  required: "Last name is required",
                })}
                placeholder="Doe"
                className="h-14 w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-12 pr-4 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </div>
            {errors.last_name && (
              <span className="text-xs text-red-500">
                {errors.last_name.message}
              </span>
            )}
          </div>

          <div className="sm:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
              Street Address
            </label>

            <div className="relative">
              <Home className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />

              <Input
                hideLabel
                {...register("address_1", {
                  required: "Street address is required",
                })}
                placeholder="123 Main Street"
                className="h-14 w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-12 pr-4 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </div>
            {errors.address_1 && (
              <span className="text-xs text-red-500">
                {errors.address_1.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm font-medium text-neutral-700">
              Apartment, Suite, etc. (Optional)
            </label>

            <Input
              hideLabel
              {...register("address_2")}
              placeholder="Apartment 2B"
              className="h-14 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none transition focus:border-black focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">City</label>

            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />

              <Input
                hideLabel
                {...register("city", { required: "City is required" })}
                placeholder="Atlanta"
                className="h-14 w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-12 pr-4 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </div>
            {errors.city && (
              <span className="text-xs text-red-500">
                {errors.city.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
              State
            </label>

            <div className="relative">
              <Map className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />

              <Input
                hideLabel
                {...register("state", { required: "State is required" })}
                placeholder="Georgia"
                className="h-14 w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-12 pr-4 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </div>
            {errors.state && (
              <span className="text-xs text-red-500">
                {errors.state.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
              ZIP Code
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />

              <Input
                hideLabel
                {...register("zip_code", { required: "ZIP code is required" })}
                placeholder="30301"
                className="h-14 w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-12 pr-4 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </div>
            {errors.zip_code && (
              <span className="text-xs text-red-500">
                {errors.zip_code.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
              Phone Number
            </label>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />

              <Input
                hideLabel
                {...register("phone", { required: "Phone number is required" })}
                placeholder="(555) 555-5555"
                className="h-14 w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-12 pr-4 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </div>
            {errors.phone && (
              <span className="text-xs text-red-500">
                {errors.phone.message}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 rounded-3xl bg-neutral-50 p-5">
        <div className="flex items-start gap-3">
          <Truck className="mt-0.5 h-5 w-5 text-neutral-600" />

          <div>
            <p className="text-sm font-medium text-neutral-900">
              Fast & Reliable Shipping
            </p>

            <p className="mt-1 text-sm leading-relaxed text-neutral-500">
              Most handmade orders are processed within 3–5 business days.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={loading || isSubmitting}
          onClick={close}
          className="h-14 rounded-2xl border border-neutral-200 px-6 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading || isSubmitting}
          className="h-14 rounded-2xl bg-black px-6 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Address"}
        </button>
      </div>
    </form>
  );
};
