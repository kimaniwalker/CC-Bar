export const getDomain = () => {
  if (process.env.VERCEL_ENV === "production") {
    return process.env.NEXT_PUBLIC_DOMAIN;
  }

  const vercelUrl =
    process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
  return vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000";
};
