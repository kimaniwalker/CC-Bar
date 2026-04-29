import { createClient } from "@/hooks/supabase/server";

export default async function ServerProducts() {

const supabase = await createClient()
  const { data: products, error } = await supabase
    .from("products")
    .select(); 
    
    if (error) {
      console.error(error);
      return null;
    }
console.log(products)
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