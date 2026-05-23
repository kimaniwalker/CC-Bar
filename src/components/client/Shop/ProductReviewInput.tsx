"use client";
import { montserrat } from "@/components/ds/Fonts";
import { Text } from "@/components/ds/Text";
import { ProductReviewFormInputs } from "@/types/ProductReview";
import { RewardActionKey } from "@/types/Rewards";
import { withRewards } from "@/utils/Rewards/withRewards";
import { handleAddProductReview } from "@/utils/Shop/handleAddProductReview";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "../Auth/AuthContext";

export const ProductReviewInput = ({ product_id }: { product_id: string }) => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<ProductReviewFormInputs>();
  const router = useRouter();
  const { user } = useUser();

  const submitReview = async (data: ProductReviewFormInputs) => {
    const rewardResult = await withRewards(
      RewardActionKey.WRITE_REVIEW,
      async () => {
        const result = await handleAddProductReview({ ...data, product_id });

        if (!result.success) {
          throw new Error(result.error || "Failed to submit review");
        }

        reset();
        router.refresh();
      },
      user?.id ?? "guest",
    );

    return rewardResult;
  };

  const onSubmit: SubmitHandler<ProductReviewFormInputs> = async (data) => {
    toast.promise(submitReview(data), {
      loading: "Submitting review...",
      success: (rewardData) => {
        if (rewardData?.data?.success && !rewardData?.data?.already_completed) {
          return `🎉 Review submitted! +${rewardData.data.reward_amount} points awarded!`;
        }
        return "✅ Review submitted!";
      },
      error: (err) => `Error: ${err.message || "Failed to submit review"}`,
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-4">
      <Text className="text-2xl font-bold mb-4">Write a Review</Text>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <Text size="sm" className="block text-sm font-medium text-gray-700">
            Name
          </Text>
          <input
            type="text"
            id="name"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 ${montserrat.className}`}
            placeholder="Your name"
            {...register("name", { required: true })}
          />
        </div>
        <div>
          <Text size="sm" className="block text-sm font-medium text-gray-700">
            Email
          </Text>
          <input
            type="email"
            id="email"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 ${montserrat.className}`}
            placeholder="Your email"
            {...register("email")}
          />
        </div>
        <div>
          <Text size="sm" className="block text-sm font-medium text-gray-700">
            Rating
          </Text>
          <select
            id="rating"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 ${montserrat.className}`}
            {...register("rating", { required: true })}
          >
            <option value="">Select a rating</option>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Terrible</option>
          </select>
        </div>
        <div>
          <Text size="sm" className="block text-sm font-medium text-gray-700">
            Comment
          </Text>
          <textarea
            {...register("comment", { required: true })}
            id="comment"
            rows={4}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 ${montserrat.className}`}
            placeholder="Write your review here..."
          />
        </div>
        <button
          disabled={!isValid}
          type="submit"
          className={`inline-flex items-center justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:bg-gray-200 disabled:text-black uppercase ${montserrat.className}`}
        >
          Submit Review
        </button>
      </form>
      <Divider />
    </div>
  );
};

const Divider = () => <hr className="my-6 border-gray-300" />;
