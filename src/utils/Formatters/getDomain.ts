// Helper function to get the correct domain
export const getDomain = () => {
  if (process.env.VERCEL_ENV === "production") {
    return process.env.NEXT_PUBLIC_DOMAIN;
  }
  // Use VERCEL_URL for preview deployments, or localhost for local dev
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
};
