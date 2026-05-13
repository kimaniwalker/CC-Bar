export const ProfileMobileTabs = () => {
    const navItems = [
        { label: 'Overview', active: true },
        { label: 'Orders' },
        { label: 'Favorites' },
        { label: 'Profile' },
      ]
    
    return (
        <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white px-4 py-3 md:hidden">
        <div className="flex gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                item.active
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>)
    }