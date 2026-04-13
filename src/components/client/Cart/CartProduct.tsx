import { Stack } from "@/components/ds/Stack";
import { Text } from "@/components/ds/Text";
import { type CartProduct } from "@/types/Product";
import Image from "next/image";
import { useCart } from "./CartContext";

export default function CartProduct(product: CartProduct) {
  const hasVariation = product.color || product.size;
  const { addToCart, removeFromCart } = useCart();
  return (
    <Stack className="w-full
lg:max-w-lg
md:max-w-md
p-6 bg-white border border-gray-200 rounded-lg shadow-sm
hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700
dark:hover:bg-gray-700 my-4">
      <Stack>
        <Stack gap="md">
          <div className="h-[100px] w-[100px] bg-gray-200 flex-shrink-0 relative rounded-lg overflow-hidden flex justify-center align-center">
            <Image
              src={product.thumbnail}
              fill
              style={{ objectFit: "cover" }}
              alt="cart image"
              sizes="100px"
            />
          </div>
          <Stack direction="col" justify="between">
            <Text
              size="md"
              className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white line-clamp-1"
            >
              {product.name}
            </Text>
            <Text
                  size="sm"
                  className="font-bold text-gray-700 dark:text-gray-400 mb-2"
                >
                  ${product.price} x {product.quantity}
                </Text>
            <div>
              {hasVariation && (
                <Text
                  size="sm"
                  className="font-bold text-gray-700 dark:text-gray-400"
                >
                  {[product.color, product.size].filter(Boolean).join(" - ")}
                </Text>
              )} 
               
              <div className="flex w-full">

                <div className="inline-flex rounded-md shadow-xs" role="group">
                  <button
                    onClick={() => removeFromCart(product.sku)}
                    type="button"
                    className="group inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-s-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                  >
                    <svg
                      className="w-[18px] h-[18px] text-inherit"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 12h14"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => addToCart(product)}
                    type="button"
                    className="group inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-e-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                  >
                    <svg
                      className="w-[18px] h-[18px] text-inherit"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 12h14m-7 7V5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
