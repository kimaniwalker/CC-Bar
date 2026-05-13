export const ProfileHeader = () => {
    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
                    Welcome Back
                  </p>
  
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                    My Account
                  </h2>
  
                  <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-500">
                    Track orders, save your favorite products, and manage your
                    account details.
                  </p>
                </div>
  
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-neutral-200 bg-[#F8F5F1] px-5 py-4 text-center">
                    <p className="text-2xl font-semibold">4</p>
                    <p className="mt-1 text-xs text-neutral-500">Orders</p>
                  </div>
  
                  <div className="rounded-2xl border border-neutral-200 bg-[#F8F5F1] px-5 py-4 text-center">
                    <p className="text-2xl font-semibold">7</p>
                    <p className="mt-1 text-xs text-neutral-500">Favorites</p>
                  </div>
  
                  <div className="rounded-2xl border border-neutral-200 bg-[#F8F5F1] px-5 py-4 text-center">
                    <p className="text-2xl font-semibold">1</p>
                    <p className="mt-1 text-xs text-neutral-500">In Transit</p>
                  </div>
                </div>
              </div>
            </div>
    )
}