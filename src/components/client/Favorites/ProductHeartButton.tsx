"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { useUser } from "../Auth/AuthContext";
import { useFavorites } from "./FavoritesContext";
import { removeFavoriteById } from "@/utils/Favorites/removeFavoriteById";
import { addUserFavorite } from "@/utils/Favorites/addUserFavorite";
import { withRewards } from "@/utils/Rewards/withRewards";
import { RewardActionKey } from "@/types/Rewards";
import { toast } from "sonner";

export const ProductHeartButton = ({
  product_id,
  className,
}: {
  product_id: string;
  className?: string;
}) => {
  const { toggleFavoriteById, productIds } = useFavorites();
  const isFavorited = productIds.includes(String(product_id));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUser();

  const handleAddFavoriteWithRewards = async () => {
    // Add favorite with rewards
    const rewardData = await withRewards(
      RewardActionKey.FIRST_FAVORITE,
      async () => {
        await addUserFavorite({
          productId: product_id,
          userId: user?.id ?? "guest",
        });
      },
      user?.id ?? "guest",
    );
    return rewardData;
  };
  const AddUserFavoriteWithRewardsAndToast = async () => {
    toast.promise(handleAddFavoriteWithRewards, {
      loading: "Adding favorite...",
      success: (data) => {
        if (data?.data?.success && !data?.data?.already_completed) {
          return `You added your first favorite! +${data?.data?.reward_amount} points awarded!`;
        }

        return "Favorites updated.";
      },

      error: (err) =>
        err?.message || "Oops something went wrong. Please try again.",
    });
  };

  const toggleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isLoading) return;
    setIsLoading(true);

    // optimistic update in context
    toggleFavoriteById(product_id);

    try {
      if (isFavorited && user?.id) {
        await removeFavoriteById({ product_id: product_id, userId: user.id });
      } else {
        await AddUserFavoriteWithRewardsAndToast();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // revert optimistic change on error
      toggleFavoriteById(product_id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`absolute z-10 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur transition hover:scale-105 ${className ? className : "right-3 top-3 "}`}
      onClick={(e) => toggleFavorite(e)}
      aria-pressed={isFavorited}
      aria-label={isFavorited ? "Remove favorite" : "Add favorite"}
      disabled={isLoading}
    >
      <Heart
        className={`h-5 w-5 transition ${isFavorited ? "fill-red-500 text-red-500" : ""}`}
      />
    </button>
  );
};
