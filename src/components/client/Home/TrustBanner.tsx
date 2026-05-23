import { Text } from "@/components/ds/Text";
import { HandHelping, PackageOpen, Star, Truck } from "lucide-react";

export const TrustBanner = () => {
  return (
    <div className="bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between space-8 items-center">
          <div className="flex flex-col justify-start items-center gap-2 my-4 text-center max-w-full sm:max-w-40 lg:max-w-full">
            <Truck size={48} color="#40b59e" />
            <Text
              size="xl"
              className="text-white font-semibold uppercase text-lg"
            >
              Free shipping over 75$
            </Text>
            <Text size="sm" className="text-white">
              Because great pieces should arrive hassle-free
            </Text>
          </div>
          <div className="flex flex-col justify-start items-center gap-2 my-4 text-center max-w-full sm:max-w-40 lg:max-w-full">
            <Star color="#e5cc2a" size={48} />
            <Text
              size="xl"
              className="text-white font-semibold uppercase text-lg"
            >
              Premium Quality
            </Text>
            <Text size="sm" className="text-white">
              Built with quality that lasts
            </Text>
          </div>
          <div className="flex flex-col justify-start items-center gap-2 my-4 text-center max-w-full sm:max-w-40 lg:max-w-full">
            <HandHelping size={48} color="#2fda4b" />
            <Text
              size="xl"
              className="text-white font-semibold uppercase text-lg"
            >
              Handmade for you
            </Text>
            <Text size="sm" className="text-white">
              Crafted carefully for every customer
            </Text>
          </div>
          <div className="flex flex-col justify-start items-center gap-2 my-4 text-center max-w-full sm:max-w-40 lg:max-w-full">
            <PackageOpen color="#9c7c07" size={48} />
            <Text
              size="xl"
              className="text-white font-semibold uppercase text-lg"
            >
              Fast processing
            </Text>
            <Text size="sm" className="text-white">
              Most orders ship in 3–5 business days
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};
