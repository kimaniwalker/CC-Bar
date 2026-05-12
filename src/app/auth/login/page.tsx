import { Login } from "@/components/client/Auth/Login";
import { Suspense } from "react";


export default async function LoginPage() {

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            </div>
      </div>
    }>
    <Login />
    </Suspense>
  );
}