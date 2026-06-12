export const CartBannerSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-1/3 bg-neutral-200 rounded mb-4" />
      <div className="h-4 w-1/2 bg-neutral-200 rounded mb-2" />
      <div className="h-4 w-1/4 bg-neutral-200 rounded" />
    </div>
  );
};
