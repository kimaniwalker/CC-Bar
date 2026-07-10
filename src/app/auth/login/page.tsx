import { Login } from "@/components/client/Auth/Login";
import { Suspense } from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Login to your account to access your orders, manage your account settings, and enjoy a personalized shopping experience.",
};

export default async function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
