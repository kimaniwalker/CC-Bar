
import { ProfilePage } from "@/components/client/Profile/ProfilePage";
import { getUser } from "@/utils/server/getUser";
import { syncUserAccount } from "@/utils/server/syncUserAccount";
import { Suspense } from "react";

export default async function Page()  {
    
    const data = await getUser();
    
    if (data) {
      await syncUserAccount(data)
    }
    
    return (
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                </div>
          </div>
        }>
          <ProfilePage data={data} />
        </Suspense>
    );
  }

 
