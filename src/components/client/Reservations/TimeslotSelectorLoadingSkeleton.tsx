export const TimeslotSelectorLoadingSkeleton = () => {
    return (<div className="mb-4">
        <ul className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
                <li
                    key={index}
                    className='px-4 py-2 border rounded-md bg-gray-200 animate-pulse text-center'
                >
                    &nbsp;
                </li>
            ))}
        </ul>
    </div>);
}