import { useSupabase } from "@/utils/supabase";
import { Suspense } from "react";

async function ProductsData() {
  const supabase = useSupabase()
  const { data: products } = await supabase.from("products").select();
  console.log(products)
  return <pre>{JSON.stringify(products, null, 2)}</pre>;
}

export default function Products() {
  return (
    <Suspense fallback={<div>Loading Products..</div>}>
      <ProductsData />
    </Suspense>
  );
}