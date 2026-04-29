import ServerProducts from "@/components/server/ServerProducts";


export default function Page() {
  return  (<div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-4xl font-bold">This is the cart page.</h1>
    <ServerProducts />
  </div>)
}
