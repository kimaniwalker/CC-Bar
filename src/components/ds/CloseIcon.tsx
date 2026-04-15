export const CloseIcon = ({onClose}:{onClose: ()=> void}) => {
    return (<button
        type="button"
        onClick={onClose}
        className="text-black hover:bg-black hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-black dark:focus:ring-gray-800 absolute right-0 top-0 transition-colors"
      >
        <svg
          className="w-6 h-6" // removed text-* here
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18 17.94 6M18 18 6.06 6"
          />
        </svg>

        <span className="sr-only">Close</span>
      </button>)
}