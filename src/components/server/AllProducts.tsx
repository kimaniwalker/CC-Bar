import { sleep } from "@/utils/sleep";
import ProductGrid from "../client/Shop/ProductGrid";
import { Product } from "@/types/Product";
import { useSupabase } from "@/utils/supabase";

export default async function AllProducts() {
  await sleep(2000);
  const supabase = useSupabase()
  const { data: products, error } = await supabase
    .from("products")
    .select(); 
    
    if (error) {
      console.error(error);
      return null;
    }
  const gridProducts = [
    {
      "id": 1,
      "sku": "SKU-001",
      "name": "Basic T-Shirt",
      "description": "A simple cotton t-shirt",
      "price": 19.99,
      "on_sale": false,
      "thumbnail": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 2,
      "sku": "SKU-002",
      "name": "Running Shoes",
      "description": "Lightweight running shoes",
      "price": 89.99,
      "on_sale": true,
      "sale_price": 69.99,
      "thumbnail": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 3,
      "sku": "SKU-002",
      "name": "Running Shoes",
      "description": "Lightweight running shoes",
      "price": 89.99,
      "on_sale": true,
      "sale_price": 69.99,
      "thumbnail": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 4,
      "sku": "SKU-002",
      "name": "Running Shoes",
      "description": "Lightweight running shoes",
      "price": 89.99,
      "on_sale": true,
      "sale_price": 69.99,
      "thumbnail": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 5,
      "sku": "SKU-002",
      "name": "Earings",
      "description": "Lightweight running shoes",
      "price": 89.99,
      "on_sale": true,
      "sale_price": 69.99,
      "thumbnail": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 6,
      sku: "SKU-003",
      name: "Hoodie",
      description: "Comfortable pullover hoodie",
      price: 49.99,
      on_sale: true,
      available_sizes: ['sm','md','lg'],
      available_colors: ['blue','red','green'],
      thumbnail: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variations: [
        {
          sku: "SKU-003-S-BLK",
          size: "S",
          color: "Black",
          price: 49.99,
          sale_price: 39.99,
          stock: 10,
        },
        {
          sku: "SKU-003-M-GRY",
          size: "M",
          color: "Gray",
          price: 49.99,
          sale_price: 39.99,
          stock: 5,
        },
      ],
    }
  ]
  return <ProductGrid products={products ?? []} />;
}
