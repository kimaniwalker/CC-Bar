
import { Logout } from "@/components/client/Auth/Logout";
import { getUser } from "@/utils/server/getUser";
import { syncUserAccount } from "@/utils/server/syncUserAccount";
import { createClient } from "@/utils/supabase/server";

export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<{ code?: string, email?: string }>;
  })  {
    const params = await searchParams;

    const data = await getUser();
    
    if (data) {
      await syncUserAccount(data)
    }
    

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          {data ? (
            <>
              <h1 className="text-2xl font-bold mb-4">Verification Successful</h1>
              <p className="text-gray-700 mb-4">Your email has been verified successfully. You can now access your account.</p>
              <details className="text-sm text-gray-600 bg-gray-50 p-3 rounded">

                <summary className="cursor-pointer font-medium">Response data</summary>
                <pre className="overflow-auto mt-2 text-xs">{JSON.stringify(data, null, 2)}</pre>
              </details>
              <Logout />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">Verification Failed</h1>
              <p className="text-gray-700">There was a problem verifying your account. Please try again or contact support.</p>
            </>
          )}
        </div>
      </div>
    );
  }
