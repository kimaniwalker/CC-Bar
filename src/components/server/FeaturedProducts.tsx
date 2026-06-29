import ProductGrid from "../client/Shop/ProductGrid";
import { getProducts } from "@/utils/Shop/getProducts";

export default async function FeaturedProducts({
  heading,
}: {
  heading?: string;
}) {
  const products = await getProducts(undefined, undefined, {
    type: "byo",
  });

  return <ProductGrid products={products ?? []} heading={heading} />;
}
