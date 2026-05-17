"use cache"
import { createClient } from "@/utils/supabase/client";

export default async function ServerProducts() {

  const supabase = createClient()
  const { data: products, error } = await supabase
    .from("products")
    .select();

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <div>
      {products?.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
        </div>
      ))}
    </div>
  );

}