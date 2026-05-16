import { Text } from "@/components/ds/Text";

export const ProductVariationTag = ({ variation, selectedVariant, heading, handleOnClick }: { variation: string[],heading: string,  handleOnClick: (value: string) => void , selectedVariant: string}) => {
  if (!variation.length) return null;
  return (
    <div>
          <Text size="lg" className="font-semibold mb-2 text-md">{heading}</Text>
          <div className="flex gap-2">
            {variation.map((variant) => (
              <button
                key={variant}
                onClick={()=>handleOnClick(variant)}
                className={`inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 uppercase ${selectedVariant=== variant ? "bg-black border-black border-2" : ""
                  }`}
              >
                <Text as="span" size="sm">{variant}</Text>
              </button>
            ))}
          </div>
        </div>
  );
}