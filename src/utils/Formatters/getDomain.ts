export const getDomain = () => {
  // Check if we have a production domain set
  if (process.env.NEXT_PUBLIC_DOMAIN || process.env.DOMAIN) {
    return process.env.NEXT_PUBLIC_DOMAIN || process.env.DOMAIN;
  }

  const vercelUrl =
    process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
  return vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000";
};
