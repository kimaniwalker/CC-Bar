import { Login } from "@/components/client/Auth/Login";
import { Suspense } from "react";

export default async function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
