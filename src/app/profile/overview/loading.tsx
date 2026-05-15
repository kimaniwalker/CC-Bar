export default function Loading() {
    return (
      <div className="min-h-screen animate-pulse bg-[#F8F5F1] text-neutral-900">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
          {/* Mobile Tabs */}
          <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white px-4 py-3 md:hidden">
            <div className="flex gap-2 overflow-x-auto">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-10 w-24 rounded-full bg-neutral-200"
                />
              ))}
            </div>
          </div>
  
          {/* Sidebar */}
          <aside className="hidden min-h-screen w-72 border-r border-neutral-200 bg-white p-6 md:block">
            <div>
              <div className="h-8 w-40 rounded-lg bg-neutral-200" />
  
              <div className="mt-4 space-y-2">
                <div className="h-4 w-full rounded bg-neutral-100" />
                <div className="h-4 w-5/6 rounded bg-neutral-100" />
              </div>
            </div>
  
            <div className="mt-10 space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-12 rounded-2xl bg-neutral-100"
                />
              ))}
            </div>
  
            <div className="mt-12 rounded-3xl border border-neutral-200 bg-[#F8F5F1] p-5">
              <div className="h-4 w-40 rounded bg-neutral-200" />
  
              <div className="mt-4 space-y-2">
                <div className="h-4 w-full rounded bg-neutral-100" />
                <div className="h-4 w-4/5 rounded bg-neutral-100" />
              </div>
  
              <div className="mt-5 h-10 w-40 rounded-full bg-neutral-200" />
            </div>
          </aside>
  
          {/* Main Content */}
          <main className="flex-1 p-4 md:p-8">
            {/* Header */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="h-4 w-28 rounded bg-neutral-200" />
  
                  <div className="mt-4 h-10 w-56 rounded-xl bg-neutral-200" />
  
                  <div className="mt-5 space-y-2">
                    <div className="h-4 w-full max-w-xl rounded bg-neutral-100" />
                    <div className="h-4 w-4/5 max-w-lg rounded bg-neutral-100" />
                  </div>
                </div>
  
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-neutral-200 bg-[#F8F5F1] px-5 py-4"
                    >
                      <div className="mx-auto h-8 w-10 rounded bg-neutral-200" />
                      <div className="mx-auto mt-3 h-3 w-16 rounded bg-neutral-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
  
            {/* Content Grid */}
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              {/* Orders */}
              <section className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-6 w-40 rounded bg-neutral-200" />
                    <div className="mt-2 h-4 w-64 rounded bg-neutral-100" />
                  </div>
  
                  <div className="h-4 w-20 rounded bg-neutral-100" />
                </div>
  
                <div className="mt-6 space-y-4">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-neutral-200 p-5"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="h-5 w-32 rounded bg-neutral-200" />
                          <div className="mt-3 h-6 w-24 rounded-full bg-neutral-100" />
                        </div>
  
                        <div className="flex items-center gap-4">
                          <div className="h-4 w-16 rounded bg-neutral-100" />
  
                          <div className="h-10 w-28 rounded-full bg-neutral-200" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
  
              {/* Favorites */}
              <section className="rounded-3xl bg-white p-6 shadow-sm">
                <div>
                  <div className="h-6 w-28 rounded bg-neutral-200" />
                  <div className="mt-2 h-4 w-56 rounded bg-neutral-100" />
                </div>
  
                <div className="mt-6 space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 rounded-2xl border border-neutral-200 p-4"
                    >
                      <div className="h-16 w-16 rounded-2xl bg-neutral-200" />
  
                      <div className="flex-1">
                        <div className="h-4 w-36 rounded bg-neutral-200" />
                        <div className="mt-2 h-3 w-16 rounded bg-neutral-100" />
                      </div>
  
                      <div className="h-10 w-24 rounded-full bg-neutral-200" />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    )
  }