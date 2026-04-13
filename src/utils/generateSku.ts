export const generateSKU = ({
  productId,
  size,
  color,
}: {
  productId: number;
  size?: string;
  color?: string;
}) => {
  const timestamp = Date.now().toString(36); // base36 timestamp
  const colorPart = color ? color.toUpperCase().slice(0, 3) : "NA";
  const sizePart = size ? size.toUpperCase() : "NOSIZE";

  return `SKU-${productId}-${sizePart}-${colorPart}-${timestamp}`;
};
