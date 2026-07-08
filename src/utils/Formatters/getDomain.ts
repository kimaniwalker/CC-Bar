export const getDomain = () => {
  if (process.env.VERCEL_ENV === "production") {
    return process.env.NEXT_PUBLIC_DOMAIN;
  }
  return process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL}`
    : "http://localhost:3000";
};
