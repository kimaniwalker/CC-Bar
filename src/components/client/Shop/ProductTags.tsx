

export const ProductTags = ({ tags }: { tags: string[] }) => {
    if (tags.length === 0) return null
    return (
        <div className="mt-2">
            {tags?.map((tag, index) => (
                <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 uppercase">
                    {tag}
                </span>
            ))}
        </div>
    )
}