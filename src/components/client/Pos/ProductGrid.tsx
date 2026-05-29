import Image from "next/image";
import { Text } from "@/components/ds/Text";
import { Product } from "@/types/Product";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onProductClick: (product: Product) => void;
}

export const ProductGrid = ({
  products,
  loading,
  onProductClick,
}: ProductGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-55 animate-pulse rounded-3xl bg-neutral-200"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
};

function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-square bg-neutral-200">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-500">
            No Image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Text size="sm">{product.name}</Text>
        <Text size="sm">${product.price.toFixed(2)}</Text>
      </div>
    </button>
  );
}
