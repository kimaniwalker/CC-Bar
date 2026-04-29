import ProductGrid from "../client/Shop/ProductGrid";
import { createClient } from "@/hooks/supabase/server";

export default async function FeaturedProducts() {

  const supabase = await createClient()
  const { data: products, error } = await supabase
    .from("products")
    .select(); 
    
    if (error) {
      console.error(error);
      return null;
    }

  return <ProductGrid products={products ?? []} />;
}
