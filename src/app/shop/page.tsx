
import { getProducts } from "@/utils/server/getProducts";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const params = await searchParams;
  const query = params.query ?? "";

  const products = await getProducts(query);

  return (
    <>
    
    <div>The user query is : {query}</div>
    <div>{products?.map((item)=> {
      return <div key={item.id}>{item.name}</div>
    })}</div>
    </>
);
}