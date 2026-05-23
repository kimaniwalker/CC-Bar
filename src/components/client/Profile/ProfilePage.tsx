import { Logout } from "../Auth/Logout";
import { getUser } from "@/utils/User/getUser";

export const ProfilePage = async () => {
  const user = await getUser();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {user ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Verification Successful</h1>
            <p className="text-gray-700 mb-4">
              Your email has been verified successfully. You can now access your
              account.
            </p>
            <details className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <summary className="cursor-pointer font-medium">
                Response data
              </summary>
              <pre className="overflow-auto mt-2 text-xs">
                {JSON.stringify(user, null, 2)}
              </pre>
            </details>
            <Logout />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Verification Failed</h1>
            <p className="text-gray-700">
              There was a problem verifying your account. Please try again or
              contact support.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
