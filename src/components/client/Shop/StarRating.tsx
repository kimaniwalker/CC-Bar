export const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, index) => (
                <svg key={index} className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09L5.64 12.545.763 9.455l6.09-.545L10 3l2.147 5.91 6.09.545-4.877 3.09L15.878 15z" />
                </svg>
            ))}
            {[...Array(emptyStars)].map((_, index) => (
                <svg key={index} className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09L5.64 12.545.763 9.455l6.09-.545L10 3l2.147 5.91 6.09.545-4.877 3.09L15.878 15z" />
                </svg>
            ))}
        </div>
    );
}